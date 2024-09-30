import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class RegisterResponseDTO {
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
