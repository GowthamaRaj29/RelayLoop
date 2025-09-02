import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseServiceKey = this.configService.get<string>('supabase.serviceKey');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing. Please check your environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    this.logger.log('Supabase client initialized successfully');
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Helper method to verify JWT tokens from frontend
  async verifyToken(token: string) {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error) {
        this.logger.warn(`Token verification failed: ${error.message}`);
        return null;
      }
      return data.user;
    } catch (error) {
      this.logger.error('Error verifying token:', error);
      return null;
    }
  }

  // Get user role and department from user metadata
  async getUserRole(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('role, department')
        .eq('id', userId)
        .single();

      if (error) {
        this.logger.warn(`Failed to get user role: ${error.message}`);
        return null;
      }

      return data;
    } catch (error) {
      this.logger.error('Error getting user role:', error);
      return null;
    }
  }
}
