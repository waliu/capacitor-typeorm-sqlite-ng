import { Component, OnInit, inject, signal } from '@angular/core';

import { UserController } from '../../../services/controllers/user/user.controller';
import { UserDto } from '../../../services/dto/user/user.dto';
import { DATABASE_INFO } from '../../../shared/database-info';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.html',
  styleUrl: './user-page.scss',
})
export class UserPage implements OnInit {
  private readonly databaseInfo = inject(DATABASE_INFO);
  private readonly userController = inject(UserController);

  protected readonly users = signal<UserDto[]>([]);
  protected readonly status = signal('Initializing TypeORM...');
  protected readonly isBusy = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly platform = this.databaseInfo.platform;
  protected readonly databaseName = this.databaseInfo.databaseName;

  async ngOnInit(): Promise<void> {
    this.status.set('Initializing TypeORM...');
    await this.run('TypeORM is ready.', async () => {
      this.users.set(await this.userController.findUsers());
    });
  }

  protected async addUser(): Promise<void> {
    await this.run('User saved.', async () => {
      this.users.set(await this.userController.addRandomUser());
    });
  }

  private async run(successMessage: string, task: () => Promise<void>): Promise<void> {
    this.isBusy.set(true);
    this.error.set(null);

    try {
      await task();
      this.status.set(successMessage);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.error.set(message);
      this.status.set('TypeORM is not ready.');
    } finally {
      this.isBusy.set(false);
    }
  }
}
