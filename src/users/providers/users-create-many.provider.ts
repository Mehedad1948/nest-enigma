import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // Inject datasource
    private readonly datasource: DataSource,
  ) {}
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];

    // Create Query runner instance
    const queryRunner = this.datasource.createQueryRunner();

    // Connect Query runner to datasource
    await queryRunner.connect();

    // Start Transaction
    await queryRunner.startTransaction();

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successful commit
      console.log('🎉🎉🎉🎉');

      await queryRunner.commitTransaction();
      return newUsers;
    } catch (error) {
      // If unsuccessful rollback
      console.log('🔥🔥🔥🔥', error);

      await queryRunner.rollbackTransaction();
      return JSON.stringify(error);
    } finally {
      // Release connection
      await queryRunner.release();
    }
  }
}
