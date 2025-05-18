import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { GoogleTokenDto } from '../dtos/google-token.dto';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    console.log('👌👌👌0', clientId);
    console.log('🚀🚀🚀🚀', clientSecret);

    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    try {
      // Verify Google token sent by user
      const loginTicket = await this.oauth2Client.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // Extract the payload from Google JWT
      console.log('➡️➡️ loginTicket', loginTicket);
      const payload = loginTicket.getPayload();

      if (
        !payload ||
        !payload.email ||
        !payload.sub ||
        !payload.given_name ||
        !payload.family_name
      ) {
        throw new Error('Invalid Google login: missing required user info');
      }

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      const user = await this.usersService.findOneByGoogle(googleId);

      if (user) {
        return this.generateTokensProvider.generateTokens(user);
      }

      const newUser = await this.usersService.createGoogleUser({
        email,
        firstName,
        lastName,
        googleId,
      });

      return this.generateTokensProvider.generateTokens(newUser);
      // Throw UnAuthorized exception
    } catch (err) {
      console.log('❌❌❌❌', err);

      throw new UnauthorizedException(err);
    }
  }
}
