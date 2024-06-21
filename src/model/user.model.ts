export class RegisterUserRequest {
  username: string;
  name: string;
  password: string;
}

export class UserResponse {
  username: string;
  name: string;
  token?: string;
}
