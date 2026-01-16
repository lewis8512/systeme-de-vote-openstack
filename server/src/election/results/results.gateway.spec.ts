import { Test, TestingModule } from '@nestjs/testing';
import { ResultsGateway } from './results.gateway';

describe('ResultsGateway', () => {
  let gateway: ResultsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultsGateway],
    }).compile();

    gateway = module.get<ResultsGateway>(ResultsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
