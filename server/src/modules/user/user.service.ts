import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers(pagination: PaginationDto) {
    try {
      const supabase = this.supabaseService.getClient();
      
      let query = supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          role,
          department,
          first_name,
          last_name,
          phone,
          is_active,
          created_at,
          updated_at
        `, { count: 'exact' });

      // Apply filters
      if (pagination.search) {
        query = query.or(`first_name.ilike.%${pagination.search}%,last_name.ilike.%${pagination.search}%,email.ilike.%${pagination.search}%`);
      }

      if (pagination.role) {
        query = query.eq('role', pagination.role);
      }

      if (pagination.department) {
        query = query.eq('department', pagination.department);
      }

      // Apply pagination
      query = query
        .range(pagination.skip, pagination.skip + pagination.limit - 1)
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        this.logger.error(`Failed to get users: ${error.message}`, error);
        throw new Error('Failed to retrieve users');
      }

      return {
        users: data || [],
        total: count || 0,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil((count || 0) / pagination.limit)
      };
    } catch (error) {
      this.logger.error(`Failed to get users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const supabase = this.supabaseService.getClient();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          role,
          department,
          first_name,
          last_name,
          phone,
          is_active,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get user by ID: ${error.message}`, error.stack);
      throw new Error('Failed to retrieve user');
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const supabase = this.supabaseService.getClient();

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: createUserDto.email,
        password: createUserDto.password,
        email_confirm: true,
        user_metadata: {
          role: createUserDto.role,
          department: createUserDto.department,
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name
        }
      });

      if (authError || !authData.user) {
        this.logger.error(`Failed to create auth user: ${authError?.message}`, authError);
        throw new BadRequestException(`Failed to create user: ${authError?.message}`);
      }

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          email: createUserDto.email,
          role: createUserDto.role,
          department: createUserDto.department,
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
          phone: createUserDto.phone,
          is_active: createUserDto.is_active ?? true
        }])
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, cleanup the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        this.logger.error(`Failed to create user profile: ${profileError.message}`, profileError);
        throw new BadRequestException(`Failed to create user profile: ${profileError.message}`);
      }

      return profileData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const supabase = this.supabaseService.getClient();

      // First check if user exists
      await this.getUserById(id);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updateUserDto,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Failed to update user: ${error.message}`, error);
        throw new BadRequestException(`Failed to update user: ${error.message}`);
      }

      // If role or department changed, update auth metadata
      if (updateUserDto.role || updateUserDto.department || updateUserDto.first_name || updateUserDto.last_name) {
        const { error: authError } = await supabase.auth.admin.updateUserById(id, {
          user_metadata: {
            role: updateUserDto.role || data.role,
            department: updateUserDto.department || data.department,
            first_name: updateUserDto.first_name || data.first_name,
            last_name: updateUserDto.last_name || data.last_name
          }
        });

        if (authError) {
          this.logger.warn(`Failed to update auth metadata: ${authError.message}`, authError);
        }
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update user');
    }
  }

  async deleteUser(id: string) {
    try {
      const supabase = this.supabaseService.getClient();

      // First check if user exists
      await this.getUserById(id);

      // Delete from user_profiles (this will cascade if properly set up)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (profileError) {
        this.logger.error(`Failed to delete user profile: ${profileError.message}`, profileError);
        throw new BadRequestException(`Failed to delete user profile: ${profileError.message}`);
      }

      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);

      if (authError) {
        this.logger.warn(`Failed to delete auth user: ${authError.message}`, authError);
        // Don't throw here as profile is already deleted
      }

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete user');
    }
  }

  async getUserStats() {
    try {
      const supabase = this.supabaseService.getClient();

      // Get total users count
      const { count: totalUsers, error: totalError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        this.logger.error(`Failed to get total users: ${totalError.message}`, totalError);
        throw new Error('Failed to get total users count');
      }

      // Get active users count
      const { count: activeUsers, error: activeError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) {
        this.logger.error(`Failed to get active users: ${activeError.message}`, activeError);
        throw new Error('Failed to get active users count');
      }

      // Get users by role
      const { data: roleData, error: roleError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('is_active', true);

      if (roleError) {
        this.logger.error(`Failed to get users by role: ${roleError.message}`, roleError);
        throw new Error('Failed to get users by role');
      }

      const usersByRole = roleData.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      // Get users by department
      const { data: deptData, error: deptError } = await supabase
        .from('user_profiles')
        .select('department')
        .eq('is_active', true)
        .not('department', 'is', null);

      if (deptError) {
        this.logger.error(`Failed to get users by department: ${deptError.message}`, deptError);
        throw new Error('Failed to get users by department');
      }

      const usersByDepartment = deptData.reduce((acc, user) => {
        if (user.department) {
          acc[user.department] = (acc[user.department] || 0) + 1;
        }
        return acc;
      }, {});

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        usersByRole,
        usersByDepartment
      };
    } catch (error) {
      this.logger.error(`Failed to get user stats: ${error.message}`, error.stack);
      throw error;
    }
  }
}
