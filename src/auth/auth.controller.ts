import { Controller, Get, Param } from '@nestjs/common';
import { IsAuthenticatedDto } from './dtos/isAuthenticated.dto';

@Controller('auth')
export class AuthController {
  @Get('/:userId')
  public isAuthenticated(@Param() isAuthenticatedDto: IsAuthenticatedDto) {
    return isAuthenticatedDto.userId;
  }
}
