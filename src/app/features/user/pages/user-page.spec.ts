import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { USER_CONTROLLER } from '../../../shared/application-services.provider';
import { UserPage } from './user-page';

describe('UserPage', () => {
  const userController = {
    platform: 'web',
    databaseName: 'transaction',
    initialize: vi.fn().mockResolvedValue([]),
    addRandomUser: vi.fn().mockResolvedValue([
      {
        userId: 1,
        userName: 'Alex Smith',
      },
    ]),
  };

  beforeEach(async () => {
    userController.initialize.mockClear();
    userController.addRandomUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [UserPage],
      providers: [
        {
          provide: USER_CONTROLLER,
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
    expect(userController.initialize).toHaveBeenCalled();
    expect(compiled.querySelector('h1')?.textContent).toContain('Database bridge');
    expect(compiled.textContent).toContain('transaction');
  });
});
