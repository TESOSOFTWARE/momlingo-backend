import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginRequestDto {
  @ApiProperty({
    example: '',
    description: 'AccessToken of facebook, gmail, apple(id_token)',
  })
  accessToken: string;
}
