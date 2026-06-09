import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserEntity } from '../../entities/user/user.entity';

export interface UserRepository {
  findAll(): Promise<UserEntity[]>;
  create(input: CreateUserDto): Promise<UserEntity>;
}
