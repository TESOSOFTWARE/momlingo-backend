import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class LoginResponseDTO {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsObject()
  user: {
    id: number;
    name: string;
    email: string;
  };
}
