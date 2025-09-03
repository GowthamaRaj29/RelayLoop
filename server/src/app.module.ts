import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { VitalSignModule } from './modules/vital-sign/vital-sign.module';
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

    // Database module - temporarily disabled until database is configured
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     url: configService.get<string>('database.url'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: configService.get<boolean>('database.synchronize'),
    //     logging: configService.get<boolean>('database.logging'),
    //     ssl: configService.get<boolean>('database.ssl') ? { rejectUnauthorized: false } : false,
    //   }),
    //   inject: [ConfigService],
    // }),

    // Application modules
    CommonModule,
    SupabaseModule,
    AuthModule,
    UserModule,
    PatientModule,
    VitalSignModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
