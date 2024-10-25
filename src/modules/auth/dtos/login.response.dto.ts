import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { UserWithChildren } from '../../user/interfaces/user-with-children.interface';

export class LoginResponseDTO {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsObject()
  user: UserWithChildren;
}
