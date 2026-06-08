import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDto } from '../../dto/user/user.dto';

export interface UserRepository {
  findAll(): Promise<UserDto[]>;
  create(input: CreateUserDto): Promise<UserDto>;
}
