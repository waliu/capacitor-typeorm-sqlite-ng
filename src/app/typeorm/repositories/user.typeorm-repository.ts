import { Repository } from 'typeorm/browser';

import { CreateUserDto } from '../../services/dto/user/create-user.dto';
import { UserEntity } from '../../services/entities/user/user.entity';
import { UserRepository } from '../../services/repositories/user/user.repository';

export class TypeOrmUserRepository implements UserRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  findAll(): Promise<UserEntity[]> {
    return this.repository.find({
      order: {
        userId: 'DESC',
      },
    });
  }

  async create(input: CreateUserDto): Promise<UserEntity> {
    const user = this.repository.create({
      userName: input.userName,
      password: input.password ?? '123456',
    });

    return this.repository.save(user);
  }
}
