export default interface IUser {
  username: string;
  password?: string;
  role: 'admin' | 'editor' | 'viewer';
  provider: 'local' | 'forum';
  forumUserId?: number;
  createdAt: Date;
  updatedAt: Date;
}
