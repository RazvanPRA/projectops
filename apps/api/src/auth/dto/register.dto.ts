import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'new.user@projectops.dev' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'New User' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  password!: string;
}
