import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-user.dto';

@Injectable()
export class UsersService {
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
