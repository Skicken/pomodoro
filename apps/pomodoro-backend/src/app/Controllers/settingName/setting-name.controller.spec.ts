import { Test, TestingModule } from '@nestjs/testing';
import { SettingNameController } from './setting-name.controller';

describe('SettingNameController', () => {
  let controller: SettingNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingNameController],
    }).compile();

    controller = module.get<SettingNameController>(SettingNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
