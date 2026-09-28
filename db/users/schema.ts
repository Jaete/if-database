import { Schema } from 'mongoose';
import IUser from './user';

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'viewer',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.set('collection', 'users');

export default UserSchema;
