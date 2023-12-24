import { Test, TestingModule } from '@nestjs/testing';
import { SettingnameService } from './settingname.service';

describe('SettingnameService', () => {
  let service: SettingnameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingnameService],
    }).compile();

    service = module.get<SettingnameService>(SettingnameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
