import { DataSourceProvider } from '../../common/data-source-provider';
import { UserDto } from '../../dto/user/user.dto';
import { UserService } from '../../services/user/user.service';

export class UserController {
  constructor(
    private readonly dataSource: DataSourceProvider,
    private readonly userService: UserService,
  ) {}

  get databaseName(): string {
    return this.dataSource.databaseName;
  }

  get platform(): string {
    return this.dataSource.platform;
  }

  async initialize(): Promise<UserDto[]> {
    await this.dataSource.initialize();
    return this.userService.findUsers();
  }

  async addRandomUser(): Promise<UserDto[]> {
    await this.userService.createRandomUser();
    await this.dataSource.persist();

    return this.userService.findUsers();
  }
}
