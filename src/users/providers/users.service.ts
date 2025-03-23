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
import { DataSource, Repository } from 'typeorm';
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

    // Inject datasource
    private readonly datasource: DataSource,
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
    throw new HttpException(
      { message: 'API does not', status: HttpStatus.MOVED_PERMANENTLY },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error('API does not exist'),
      },
    );
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

  public async createMany(createUsersDto: CreateUserDto[]) {
    let newUsers: User[] = [];

    // Create Query runner instance
    const queryRunner = this.datasource.createQueryRunner();

    // Connect Query runner to datasource
    await queryRunner.connect();

    // Start Transaction
    await queryRunner.startTransaction();

    try {
      for (const user of createUsersDto) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successful commit
      await queryRunner.commitTransaction();
      return newUsers;
    } catch (error) {
      // If unsuccessful rollback
      await queryRunner.rollbackTransaction();
    } finally {
      // Release connection
      await queryRunner.release();
    }
  }
}
