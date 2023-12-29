import { Test, TestingModule } from '@nestjs/testing';
import { SettingNameService } from './settingname.service';

describe('SettingnameService', () => {
  let service: SettingNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingNameService],
    }).compile();

    service = module.get<SettingNameService>(SettingNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
