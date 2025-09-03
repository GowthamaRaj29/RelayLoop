import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAllUsers(@Query() pagination: PaginationDto) {
    const users = await this.userService.getAllUsers(pagination);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users
    };
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getStats() {
    const stats = await this.userService.getUserStats();
    
    return {
      statusCode: HttpStatus.OK,
      message: 'User statistics retrieved successfully',
      data: stats
    };
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user
    };
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user
    };
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, updateUserDto);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully'
    };
  }
}
