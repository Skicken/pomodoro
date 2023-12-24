import { Test, TestingModule } from '@nestjs/testing';
import { TemplateServiceService } from './template-service.service';

describe('TemplateServiceService', () => {
  let service: TemplateServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateServiceService],
    }).compile();

    service = module.get<TemplateServiceService>(TemplateServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
