import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
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
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
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
}
