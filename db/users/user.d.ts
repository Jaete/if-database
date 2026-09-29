export default interface IUser {
  username: string;
  password?: string;
  role: 'admin' | 'editor' | 'viewer';
  provider: 'local' | 'forum';
  forumUserId?: number;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
