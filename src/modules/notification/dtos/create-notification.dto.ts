import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsSemVer, IsString } from 'class-validator';
import { NotificationType } from '../../../enums/notification-type.enum';

export class CreateNotificationDto {
  @IsString()
  title?: string;

  @IsString()
  body?: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsInt()
  actorId: number;

  @IsInt()
  postId: number;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsBoolean()
  readed?: boolean;
}
