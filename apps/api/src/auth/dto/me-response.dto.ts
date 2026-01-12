import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({ example: 'ckx...' })
  userId!: string;

  @ApiProperty({ example: 'admin@projectops.dev' })
  email!: string;

  @ApiProperty({ example: 'admin' })
  role!: string;
}
