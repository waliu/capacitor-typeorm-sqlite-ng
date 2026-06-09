import { User } from '../../entities/user/user';

export interface CreateUserInput {
  readonly userName: string;
  readonly password: string;
}

export interface UserRepository {
  findAll(): Promise<User[]>;
  create(input: CreateUserInput): Promise<User>;
}
