import { model, models } from 'mongoose';
import IUser from './user';
import UserSchema from './schema';

const modelName = 'User';

if (models[modelName]) {
  delete models[modelName];
}

const User = model<IUser>(modelName, UserSchema);

export default User;
