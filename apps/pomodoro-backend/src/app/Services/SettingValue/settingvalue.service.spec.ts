import { Test, TestingModule } from '@nestjs/testing';
import { SettingvalueService } from './settingvalue.service';

describe('SettingvalueService', () => {
  let service: SettingvalueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingvalueService],
    }).compile();

    service = module.get<SettingvalueService>(SettingvalueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
