import { UserDto } from '../../dto/user/user.dto';
import { UserService } from '../../services/user/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  findUsers(): Promise<UserDto[]> {
    return this.userService.findUsers();
  }

  async addRandomUser(): Promise<UserDto[]> {
    await this.userService.createRandomUser();

    return this.userService.findUsers();
  }
}
