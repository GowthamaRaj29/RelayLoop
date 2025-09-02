import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { VitalSignModule } from './modules/vital-sign/vital-sign.module';
import { DepartmentModule } from './modules/department/department.module';
import { CommonModule } from './modules/common/common.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Application modules
    CommonModule,
    SupabaseModule,
    AuthModule,
    UserModule,
    PatientModule,
    VitalSignModule,
    DepartmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
