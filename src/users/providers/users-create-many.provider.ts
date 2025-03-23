import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { User } from '../user.entity';

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
    try {
      await queryRunner.connect();

      // Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to create user, please try again later',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    try {
      for (const user of createManyUsersDto.users) {
        const isEmailUnique = await queryRunner.manager.findOne(User, {
          where: { email: user.email },
        });
        if (isEmailUnique) {
          throw new ConflictException(`Email ${user.email} already exists`);
        }
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
      console.log('🔥🔥��🔥', error);

      try {
        await queryRunner.rollbackTransaction();
      } catch (rollbackError) {
        console.error('Error during transaction rollback:', rollbackError);
        throw new InternalServerErrorException('Transaction rollback failed', {
          cause: rollbackError,
          description: 'Failed to rollback database transaction after error',
        });
      }

      // Handle specific error types
      if (error instanceof ConflictException) {
        throw error; // Re-throw email conflict errors
      }

      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Invalid data provided', {
          cause: error,
          description: 'Database operation failed due to invalid data',
        });
      }

      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to create users', {
          cause: error,
          description: 'An unexpected error occurred while creating users',
        });
      }

      throw new InternalServerErrorException('Unknown error occurred');
    } finally {
      // Release connection
      try {
        await queryRunner.release();
      } catch (error) {
        console.error('Error releasing database connection:', error);
        // Log error but don't throw to avoid masking original error
      }
    }
  }
}
