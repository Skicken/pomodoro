import { Test, TestingModule } from '@nestjs/testing';
import { SettingValueController } from './setting-value.controller';

describe('SettingValueController', () => {
  let controller: SettingValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingValueController],
    }).compile();

    controller = module.get<SettingValueController>(SettingValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
