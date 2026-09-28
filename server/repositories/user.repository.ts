import User, { IUser } from '@/server/models/User';
import UtmCampaign from '@/server/models/UtmCampaign';
import ServiceEnquiry from '@/server/models/ServiceEnquiry';
import mongoose from 'mongoose';

export type IdentityCheckResult =
  | { type: 'NO_MATCH'; user: null }
  | { type: 'EXACT_MATCH'; user: IUser }
  | { type: 'SPLIT_IDENTITY'; user: null }
  | { type: 'PARTIAL_MISMATCH'; user: null };

export class UserRepository {
  /**
   * Checks for identity matches and conflicts:
   * - Split Match: Email matches User A, phone matches User B
   * - Partial Mismatch: Email matches User A, but User A's stored phone != submitted phone
   * - Exact Match: Email and phone belong to the same existing user
   * - No Match: New user
   */
  async checkIdentity(email: string, phone: string): Promise<IdentityCheckResult> {
    const [userByEmail, userByPhone] = await Promise.all([
      User.findOne({ email }).exec(),
      User.findOne({ phone }).exec(),
    ]);

    // Both match different users
    if (userByEmail && userByPhone && userByEmail._id.toString() !== userByPhone._id.toString()) {
      return { type: 'SPLIT_IDENTITY', user: null };
    }

    // Email matches, but phone belongs to no one else yet differs from stored phone
    if (userByEmail && (!userByPhone || userByEmail.phone !== phone)) {
      return { type: 'PARTIAL_MISMATCH', user: null };
    }

    // Phone matches, but email belongs to no one else yet differs from stored email
    if (userByPhone && (!userByEmail || userByPhone.email !== email)) {
      return { type: 'PARTIAL_MISMATCH', user: null };
    }

    // Exact match for existing user
    if (userByEmail && userByPhone) {
      return { type: 'EXACT_MATCH', user: userByEmail };
    }

    return { type: 'NO_MATCH', user: null };
  }

  async createUser(userData: Partial<IUser>, campaignData: any, serviceEnquiryData: any): Promise<IUser> {
    const session = await mongoose.startSession();
    let createdUser: IUser | undefined;

    try {
      await session.withTransaction(async () => {
        // Re-check inside transaction to prevent concurrent race conditions
        const identity = await this.checkIdentity(userData.email!, userData.phone!);
        if (identity.type !== 'NO_MATCH') {
          throw new Error('IDENTITY_CONFLICT');
        }

        const [user] = await User.create([userData], { session });
        createdUser = user;

        // Create campaign touchpoint (unattributed/direct if no UTM fields present)
        await UtmCampaign.create([{ userId: user._id, ...campaignData }], { session });

        // Create enquiry record
        await ServiceEnquiry.create([{ userId: user._id, ...serviceEnquiryData }], { session });
      });

      return createdUser!;
    } finally {
      await session.endSession();
    }
  }

  async updateExistingUser(
    userId: mongoose.Types.ObjectId,
    userData: Partial<IUser>,
    campaignData: any,
    serviceEnquiryData: any
  ): Promise<boolean> {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              name: userData.name,
              countryCode: userData.countryCode,
              timezone: userData.timezone,
            },
          },
          { session }
        );

        // Append new campaign touchpoint (preserves earlier touchpoints)
        await UtmCampaign.create([{ userId, ...campaignData }], { session });

        // Append new enquiry record (preserves earlier enquiries)
        await ServiceEnquiry.create([{ userId, ...serviceEnquiryData }], { session });
      });

      return true;
    } finally {
      await session.endSession();
    }
  }
}
