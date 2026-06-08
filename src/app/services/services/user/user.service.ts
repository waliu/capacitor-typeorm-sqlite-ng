import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDto } from '../../dto/user/user.dto';
import { UserRepository } from '../../repositories/user/user.repository';

export class UserService {
  private readonly firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan'];
  private readonly lastNames = ['Smith', 'Johnson', 'Brown', 'Anderson', 'Martin'];

  constructor(private readonly userRepository: UserRepository) {}

  findUsers(): Promise<UserDto[]> {
    return this.userRepository.findAll();
  }

  createUser(input: CreateUserDto): Promise<UserDto> {
    return this.userRepository.create(input);
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
}
