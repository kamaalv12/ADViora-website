import { UserRepository } from '@/server/repositories/user.repository';
import { SignupSchema, UserDetailsQuerySchema } from '@/server/validators/user.validator';
import { z } from 'zod';
import UtmCampaign from '@/server/models/UtmCampaign';
import { getDateRangeBounds } from '@/server/utils/timezone';
import { logger } from '@/server/utils/logger';

export class UserService {
  constructor(private repository: UserRepository) {}

  async registerUser(data: z.infer<typeof SignupSchema>, clientIp?: string, userAgent?: string) {
    const identity = await this.repository.checkIdentity(data.email, data.phone);

    if (identity.type === 'SPLIT_IDENTITY' || identity.type === 'PARTIAL_MISMATCH') {
      logger.warn({ conflictType: identity.type }, 'Identity conflict detected during enquiry processing');
      const err = new Error('IDENTITY_CONFLICT');
      (err as any).code = 'IDENTITY_CONFLICT';
      throw err;
    }

    const campaignData = {
      route: data.route,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_content: data.utm_content,
      platform: data.platform,
      gclid: data.gclid,
      fbclid: data.fbclid,
      fbp: data.fbp,
      fbc: data.fbc,
      utm_term: data.utm_term,
      matchtype: data.matchtype,
      network: data.network,
      device: data.device,
      keyword: data.keyword,
      placement: data.placement,
      campaignid: data.campaignid,
      adgroupid: data.adgroupid,
      clientIp,
      userAgent,
    };

    const serviceEnquiryData = {
      interest: data.interest,
      message: data.message,
    };

    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      countryCode: data.countryCode,
      timezone: data.timezone,
    };

    if (identity.type === 'EXACT_MATCH') {
      logger.info({ status: 'existing' }, 'Existing user enquiry processed and touchpoint appended');
      await this.repository.updateExistingUser(
        identity.user._id as any,
        userData,
        campaignData,
        serviceEnquiryData
      );
      return { status: 'existing' };
    }

    logger.info({ status: 'new' }, 'New user created with enquiry and touchpoint');
    await this.repository.createUser(userData, campaignData, serviceEnquiryData);
    return { status: 'new' };
  }

  async getUserDetails(query: z.infer<typeof UserDetailsQuerySchema>) {
    const { startDate, endDate, page, limit, range } = query;
    const skip = (page - 1) * limit;

    const { start, end } = getDateRangeBounds(range, startDate, endDate, 'Asia/Kolkata');

    const filter: any = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    const [total, campaigns] = await Promise.all([
      UtmCampaign.countDocuments(filter),
      UtmCampaign.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'service_enquiries',
            let: { searchUserId: '$userId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$userId', '$$searchUserId'] } } },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: 'serviceEnquiry',
          },
        },
        { $unwind: { path: '$serviceEnquiry', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            userCreatedAt: '$user.createdAt',
            utmCreatedAt: '$createdAt',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$user', '$serviceEnquiry', '$$ROOT'],
            },
          },
        },
        {
          $project: {
            __v: 0,
            updatedAt: 0,
            createdAt: 0,
            userId: 0,
            user: 0,
            serviceEnquiry: 0,
          },
        },
      ]),
    ]);

    return {
      data: campaigns,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
