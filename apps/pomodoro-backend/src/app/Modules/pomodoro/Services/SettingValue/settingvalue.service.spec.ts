import { Test, TestingModule } from '@nestjs/testing';
import { SettingValueService } from './settingvalue.service';

describe('SettingvalueService', () => {
  let service: SettingValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingValueService],
    }).compile();

    service = module.get<SettingValueService>(SettingValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
