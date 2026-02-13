import { Module } from '@nestjs/common';
import { SocietiesService } from './societies.service';
import { SocietiesController } from './societies.controller';
import { RelationalSocietyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalSocietyPersistenceModule],
  controllers: [SocietiesController],
  providers: [SocietiesService],
  exports: [SocietiesService, RelationalSocietyPersistenceModule],
})
export class SocietiesModule {}
