import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserDto, isArray: true })
  async list(): Promise<UserDto[]> {
    const users = await this.users.list();
    return users.map((user) => {
      const dto = new UserDto();
      dto.id = user.id;
      dto.email = user.email;
      dto.name = user.name;
      dto.role = user.role;
      dto.createdAt = user.createdAt.toISOString();
      dto.updatedAt = user.updatedAt.toISOString();
      return dto;
    });
  }
}
