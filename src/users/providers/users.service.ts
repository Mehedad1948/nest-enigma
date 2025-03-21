import { BadRequestException, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    //  check is user already exists with same email
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    } else {
      const user = this.userRepository.create(createUserDto);
      return this.userRepository.save(user);
    }
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return [
      { firstName: 'John', email: 'john@doe' },
      { firstName: 'John2', email: 'john@doe2' },
    ];
  }

  public findOneById(id: number) {
    return [{ firstName: 'John', email: 'john@doe', id }];
  }
}
