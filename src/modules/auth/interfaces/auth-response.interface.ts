export interface AuthResponse {
  access_token: string;
  user: {
    identification: number;
    first_name: string;
    last_name: string;
    email: string;
    rol: string;
  };
}
