import User, { IUser } from '@/server/models/User';
import UtmCampaign from '@/server/models/UtmCampaign';
import ServiceEnquiry from '@/server/models/ServiceEnquiry';

import mongoose from 'mongoose';

export class UserRepository {
  async findByEmailOrPhone(email: string | undefined, phone: string): Promise<IUser | null> {
    const conditions: any[] = [{ phone }];
    if (email) conditions.push({ email });
    return User.findOne({ $or: conditions });
  }

  async createUser(userData: Partial<IUser>, campaignData: any, serviceEnquiryData: any): Promise<IUser> {
    const session = await mongoose.startSession();
    let createdUser: IUser | undefined;

    try {
      await session.withTransaction(async () => {
        // Check again inside transaction to prevent race conditions
        const conditions: any[] = [{ phone: userData.phone }];
        if (userData.email) conditions.push({ email: userData.email });

        const existingUser = await User.findOne({ 
          $or: conditions 
        }).session(session);

        if (existingUser) {
          throw new Error('USER_ALREADY_EXISTS');
        }

        const [user] = await User.create([userData], { session });
        createdUser = user;
        
        // Execute sequentially: MongoDB transactions do not support concurrent operations with the same session
        if (Object.keys(campaignData).length > 0) {
          await UtmCampaign.create([{ userId: user._id, ...campaignData }], { session });
        }
        if (Object.keys(serviceEnquiryData).length > 0) {
          await ServiceEnquiry.create([{ userId: user._id, ...serviceEnquiryData }], { session });
        }
      });

      return createdUser!;
    } finally {
      await session.endSession();
    }
  }

  async updateExistingUser(userId: mongoose.Types.ObjectId, userData: Partial<IUser>, campaignData: any, serviceEnquiryData: any) {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        if (userData) {
          await User.findByIdAndUpdate(userId, {
            $set: {
              name: userData.name,
              countryCode: userData.countryCode,
              timezone: userData.timezone,
            }
          }, { session });
        }

        // Execute sequentially: MongoDB transactions do not support concurrent operations with the same session
        if (Object.keys(campaignData).length > 0) {
          await UtmCampaign.create([{ userId, ...campaignData }], { session });
        }
        if (Object.keys(serviceEnquiryData).length > 0) {
          await ServiceEnquiry.create([{ userId, ...serviceEnquiryData }], { session });
        }
      });
      return true;
    } finally {
      await session.endSession();
    }
  }
}
