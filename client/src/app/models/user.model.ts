// client/src/app/models/user.model.ts
export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface LoginData {
  email?: string;
  password?: string;
}

export interface RegisterData {
  username?: string;
  email?: string;
  password?: string;
}
