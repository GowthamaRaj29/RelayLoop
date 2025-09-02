import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { MLPredictionService } from './ml-prediction.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PatientController],
  providers: [PatientService, MLPredictionService],
  exports: [PatientService, MLPredictionService],
})
export class PatientModule {}
