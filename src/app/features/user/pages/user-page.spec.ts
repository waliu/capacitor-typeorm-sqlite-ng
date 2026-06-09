import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { UserController } from '../../../services/controllers/user/user.controller';
import { DATABASE_INFO } from '../../../shared/database-info';
import { UserPage } from './user-page';

describe('UserPage', () => {
  const database = {
    platform: 'web',
    databaseName: 'transaction',
  };

  const userController = {
    findUsers: vi.fn().mockResolvedValue([]),
    addRandomUser: vi.fn().mockResolvedValue([
      {
        userId: 1,
        userName: 'Alex Smith',
      },
    ]),
  };

  beforeEach(async () => {
    userController.findUsers.mockClear();
    userController.addRandomUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [UserPage],
      providers: [
        {
          provide: DATABASE_INFO,
          useValue: database,
        },
        {
          provide: UserController,
          useValue: userController,
        },
      ],
    }).compileComponents();
  });

  it('renders database metadata through the user controller', async () => {
    const fixture = TestBed.createComponent(UserPage);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(userController.findUsers).toHaveBeenCalled();
    expect(compiled.querySelector('h1')?.textContent).toContain('Database bridge');
    expect(compiled.textContent).toContain('transaction');
  });
});
