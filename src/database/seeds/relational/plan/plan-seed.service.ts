import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from '../../../../plans/infrastructure/persistence/relational/entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanSeedService {
  constructor(
    @InjectRepository(PlanEntity)
    private repository: Repository<PlanEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create({
          name: 'Free',
          price: 0,
        }),
      );
    }
  }
}
