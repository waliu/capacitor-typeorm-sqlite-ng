import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDto } from '../../dto/user/user.dto';
import { User } from '../../entities/user/user';
import { UserRepository } from '../../repositories/user/user.repository';

export class UserService {
  private readonly defaultPassword = '123456';
  private readonly firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan'];
  private readonly lastNames = ['Smith', 'Johnson', 'Brown', 'Anderson', 'Martin'];

  constructor(private readonly userRepository: UserRepository) {}

  async findUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => this.toDto(user));
  }

  async createUser(input: CreateUserDto): Promise<UserDto> {
    const userName = input.userName.trim();

    if (!userName) {
      throw new Error('User name is required.');
    }

    const user = await this.userRepository.create({
      userName,
      password: input.password ?? this.defaultPassword,
    });

    return this.toDto(user);
  }

  createRandomUser(): Promise<UserDto> {
    return this.createUser({
      userName: this.generateRandomName(),
    });
  }

  private generateRandomName(): string {
    const firstName = this.pick(this.firstNames);
    const lastName = this.pick(this.lastNames);

    return `${firstName} ${lastName}`;
  }

  private pick(values: readonly string[]): string {
    return values[Math.floor(Math.random() * values.length)];
  }

  private toDto(user: User): UserDto {
    return {
      userId: user.userId,
      userName: user.userName,
    };
  }
}
