import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'admin@projectops.dev' })
  email!: string;

  @ApiProperty({ example: 'Admin' })
  name!: string;

  @ApiProperty({ enum: ['admin', 'viewer'] })
  role!: 'admin' | 'viewer';

  @ApiProperty({ example: '2026-02-12T11:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-02-12T11:00:00.000Z' })
  updatedAt!: string;
}
