import { Module } from '@nestjs/common';
import { VitalSignService } from './vital-sign.service';
import { VitalSignController } from './vital-sign.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [VitalSignController],
  providers: [VitalSignService],
  exports: [VitalSignService],
})
export class VitalSignModule {}
