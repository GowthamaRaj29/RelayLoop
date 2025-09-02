import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

    // Core modules
    SupabaseModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
