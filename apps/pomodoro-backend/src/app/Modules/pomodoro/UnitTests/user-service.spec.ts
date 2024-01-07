import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import { ReturnUserDTO } from '../Dto/user-dto';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { passwordHash } from '../../common/common';
import { config } from 'dotenv';
import { UserService } from '../Services/User/user.service';
import { AddUserDTO } from '../Dto/add-user-dto';
import { UpdateUserDTO } from '../Dto/update-user-dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: DeepMockProxy<{
    [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
  }>;
  beforeEach(async () => {
    config({ path: 'apps/pomodoro-backend/.env' });

    const module = await Test.createTestingModule({
      providers: [PrismaService, UserService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  const user: User = {
    id: 1,
    createdAt: undefined,
    userType: 'USER',
    nickname: 'test',
    email: 'test@wp.pl',
    password: passwordHash('1234'),
    spotifyToken: '',
  };
  const users: User[] = [
    user,
    {
      id: 2,
      createdAt: undefined,
      userType: 'USER',
      nickname: 'test1',
      email: 'test1@wp.pl',
      password: passwordHash('1234'),
      spotifyToken: '',
    },
  ];

  it('add user', async () => {
    const addUser: AddUserDTO = {
      nickname: 'test',
      password: 'test@wp.pl',
      email: '1234',
    };
    await prisma.user.create.mockResolvedValueOnce(user);

    const returnUser: ReturnUserDTO = await service.addUser(addUser);

    expect(returnUser).toBeDefined();
    expect(returnUser.password).toBeUndefined();
    expect(returnUser.nickname).toBe('test');
  });
  it('get user', async () => {
    await prisma.user.findFirst.mockResolvedValueOnce(user);

    const returnUser: ReturnUserDTO = await service.getUser(1);

    expect(returnUser).toBeDefined();
    expect(returnUser.password).toBeUndefined();
    expect(returnUser.nickname).toBe('test');
  });

  it('get users', async () => {
    await prisma.user.findMany.mockResolvedValueOnce(users);
    const returnUser: ReturnUserDTO[] = await service.getUsers();

    expect(returnUser).toBeDefined();
    returnUser.forEach((user) => {
      expect(user.password).toBeUndefined();
    });
  });
  it('update user', async () => {
    const update: UpdateUserDTO  ={
      nickname: 'test1',
      password: 'test1@wp.pl',
      spotifyToken: ''
    }
    const copyUser = user;
    copyUser.nickname = update.nickname;
    copyUser.password = passwordHash(update.password);

    await prisma.user.update.mockResolvedValueOnce(copyUser);
    const returnUser: ReturnUserDTO = await service.updateUser(1,update);

    expect(returnUser).toBeDefined();
    expect(returnUser.password).toBeUndefined();
    expect(returnUser.nickname).toBe('test1');
  });

});
