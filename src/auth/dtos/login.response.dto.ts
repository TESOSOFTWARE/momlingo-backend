import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { User } from '../../models/users/entities/user.entity';

export class LoginResponseDTO {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsObject()
  user: User;
}
