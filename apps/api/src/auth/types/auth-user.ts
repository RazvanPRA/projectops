export type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'viewer';
};
