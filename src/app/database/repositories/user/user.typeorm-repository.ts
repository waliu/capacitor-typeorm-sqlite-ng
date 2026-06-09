import { Repository } from 'typeorm/browser';

import { UserTypeormEntity } from '../../entities/user/user.typeorm-entity';
import { User } from '../../../services/entities/user/user';
import {
  CreateUserInput,
  UserRepository,
} from '../../../services/repositories/user/user.repository';

export class TypeOrmUserRepository implements UserRepository {
  constructor(private readonly repository: Repository<UserTypeormEntity>) {}

  async findAll(): Promise<User[]> {
    const users = await this.repository.find({
      order: {
        userId: 'DESC',
      },
    });

    return users.map((user) => this.toUser(user));
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = this.repository.create({
      userName: input.userName,
      password: input.password,
    });

    return this.toUser(await this.repository.save(user));
  }

  private toUser(entity: UserTypeormEntity): User {
    return {
      userId: entity.userId,
      userName: entity.userName,
      password: entity.password,
    };
  }
}
