import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

// 🚀 Controllers Should ONLY hold routing logic and All other logics should be Written in Providers
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getAllUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: any,
  ) {
    return `Users get method ${page} ${JSON.stringify(limit)}`;
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  public getUserById(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUsers(
    @Body() createUserDto: CreateUserDto,
    @Headers() headers: any,
  ) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  public patchUsers(@Body() patchUseDto: PatchUserDto) {
    return patchUseDto;
  }
}
