import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import profileConfig from '../config/profile.config';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetUsersParamDto } from '../dtos/get-user.dto';
import { User } from '../user.entity';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    // Inject createMayProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // Inject createUserProvider
    private readonly createUserProvider: CreateUserProvider,

    // Inject findOneUserByEmailProvider
    private readonly usersFindOneByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      { message: 'API does not', status: HttpStatus.MOVED_PERMANENTLY },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error('API does not exist'),
      },
    );
  }

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to find user, please try again later',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async findOneByEmail(email: string) {
    return this.usersFindOneByEmailProvider.findOneByEmail(email);
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
}
