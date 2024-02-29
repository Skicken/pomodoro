import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { config } from 'dotenv';
import { SettingValueService } from '../Services/SettingValue/settingvalue.service';

describe('SettingValueService', () => {
  let service: SettingValueService;
  let prisma: DeepMockProxy<{
    [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
  }>;
  beforeEach(async () => {
    config({ path: 'apps/pomodoro-backend/.env' });

    const module = await Test.createTestingModule({
      providers: [PrismaService, SettingValueService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(SettingValueService);
    prisma = module.get(PrismaService);
  });
  it('add user', async () => {

  });

});
