import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDTO {
  @ApiProperty({ example: 'Le Van A', description: '' })
  name: string;

  @ApiProperty({ example: 'abc@gmail.com', description: 'Gmail' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Pass greater than 6 chars' })
  password: string;
}
