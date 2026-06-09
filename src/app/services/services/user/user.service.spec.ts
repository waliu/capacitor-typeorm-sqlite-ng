import { UserEntity } from '../../entities/user/user.entity';
import { UserRepository } from '../../repositories/user/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  const users: UserEntity[] = [
    {
      userId: 1,
      userName: 'Alex Smith',
      password: '123456',
    },
  ];

  function createService(repository: Partial<UserRepository> = {}): UserService {
    return new UserService({
      findAll: () => Promise.resolve(users),
      create: (input) =>
        Promise.resolve({
          userId: 2,
          userName: input.userName,
          password: input.password ?? '123456',
        }),
      ...repository,
    });
  }

  it('maps user entities to DTOs', async () => {
    const service = createService();

    await expect(service.findUsers()).resolves.toEqual([
      {
        userId: 1,
        userName: 'Alex Smith',
      },
    ]);
  });

  it('trims user names before saving', async () => {
    const created: Array<{ password?: string; userName: string }> = [];
    const service = createService({
      create: async (input) => {
        created.push(input);
        return {
          userId: 2,
          userName: input.userName,
          password: input.password ?? '123456',
        };
      },
    });

    await expect(
      service.createUser({
        userName: '  Morgan Brown  ',
      }),
    ).resolves.toEqual({
      userId: 2,
      userName: 'Morgan Brown',
    });
    expect(created).toEqual([{ password: undefined, userName: 'Morgan Brown' }]);
  });

  it('rejects empty user names', async () => {
    const service = createService();

    await expect(service.createUser({ userName: '   ' })).rejects.toThrow(
      'User name is required.',
    );
  });
});
