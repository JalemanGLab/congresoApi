import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interfaces';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'decorator/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':identification')
  findOne(@Param('identification', ParseIntPipe) identification: number) {
    return this.usersService.findOne(identification);
  }

  @Post()
  create(@Body() createUserDto: Omit<User, 'created_at'>) {
    return this.usersService.create(createUserDto);
  }

  @Put(':identification')
  update(
    @Param('identification', ParseIntPipe) identification: number,
    @Body() updateUserDto: Partial<Omit<User, 'identification' | 'created_at'>>,
  ) {
    return this.usersService.update(identification, updateUserDto);
  }
}
