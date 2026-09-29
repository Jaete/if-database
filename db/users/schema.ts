import { Schema } from 'mongoose';
import IUser from './user';

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'viewer',
    },
    provider: {
      type: String,
      enum: ['local', 'forum'],
      default: 'local',
    },
    forumUserId: { type: Number, unique: true, sparse: true },
    // Always a forum-hosted image URL, filtered through sanitizeForumAvatar.
    avatarUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.set('collection', 'users');

export default UserSchema;
