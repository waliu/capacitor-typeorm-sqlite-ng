import { DataSourceProvider } from '../../common/data-source-provider';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDto } from '../../dto/user/user.dto';
import { UserEntity } from '../../entities/user/user.entity';
import { UserRepository } from './user.repository';

export class TypeOrmUserRepository implements UserRepository {
  constructor(private readonly dataSource: DataSourceProvider) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.dataSource.getRepository(UserEntity).find({
      order: {
        userId: 'DESC',
      },
    });

    return users.map((user) => this.toDto(user));
  }

  async create(input: CreateUserDto): Promise<UserDto> {
    const repository = this.dataSource.getRepository(UserEntity);
    const user = repository.create({
      userName: input.userName,
      password: input.password ?? '123456',
    });

    return this.toDto(await repository.save(user));
  }

  private toDto(user: UserEntity): UserDto {
    return {
      userId: user.userId,
      userName: user.userName,
    };
  }
}
