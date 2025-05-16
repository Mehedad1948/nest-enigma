import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IsAuthenticatedDto } from './dtos/isAuthenticated.dto';
import { SignInDto } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/:userId')
  public isAuthenticated(@Param() isAuthenticatedDto: IsAuthenticatedDto) {
    return isAuthenticatedDto.userId;
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.none)
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
