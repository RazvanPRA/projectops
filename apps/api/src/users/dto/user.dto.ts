export type UserDto = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
  createdAt: string;
  updatedAt: string;
};
