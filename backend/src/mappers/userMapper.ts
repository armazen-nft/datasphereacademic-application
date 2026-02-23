import { IUser } from '../../../shared/types';
import { IUserDocument } from '../models/User';
import { BaseMapper } from './baseMapper';

export class UserMapper extends BaseMapper<IUserDocument, IUser> {
  toDTO(doc: IUserDocument): IUser {
    return {
      id: doc.id || doc._id.toString(),
      type: doc.type,
      name: doc.name,
      email: doc.email,
      avatar: doc.avatar,
      bio: doc.bio,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      reputation: doc.reputation,
      aiProfile: doc.aiProfile,
      humanProfile: doc.humanProfile
    };
  }
}

export const userMapper = new UserMapper();
