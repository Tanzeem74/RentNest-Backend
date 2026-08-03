export interface ILoginUser {
  email: string;
  password: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}