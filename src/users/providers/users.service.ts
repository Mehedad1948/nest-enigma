import {
  BadRequestException,
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
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    //  check is user already exists with same email
    let user: User | null = null;
    try {
      user = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to create user, please try again later',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    if (user) {
      throw new BadRequestException('User already exists');
    } else {
      const newUser = this.userRepository.create(createUserDto);
      try {
        return this.userRepository.save(newUser);
      } catch (error) {
        throw new RequestTimeoutException(
          'Unable to create user, please try again later',
          {
            description: 'Error connecting to the database',
            cause: error,
          },
        );
      }
    }
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return [
      { firstName: 'Johasddsdsdsn', email: 'john@doe' },
      { firstName: 'John2', email: 'john@doe2' },
    ];
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
}
