import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  Request, 
  HttpStatus,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Departments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new department (Admin only)' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 409, description: 'Conflict - Department name already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createDepartment(@Body(ValidationPipe) createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentService.createDepartment(createDepartmentDto);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Department created successfully',
      data: department
    };
  }

  @Get()
  @Roles('admin', 'doctor', 'nurse')
  @ApiOperation({ summary: 'Get all hospital departments' })
  @ApiResponse({ status: 200, description: 'Departments retrieved successfully' })
  async getDepartments() {
    const departments = await this.departmentService.getDepartments();
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Departments retrieved successfully',
      data: departments
    };
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all department statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Department statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAllDepartmentStats() {
    const stats = await this.departmentService.getDepartmentStats();
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department statistics retrieved successfully',
      data: stats
    };
  }

  @Get(':id')
  @Roles('admin', 'doctor', 'nurse')
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiResponse({ status: 200, description: 'Department retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async getDepartmentById(@Param('id') id: string) {
    const department = await this.departmentService.getDepartmentById(id);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department retrieved successfully',
      data: department
    };
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update department (Admin only)' })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Department name already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateDepartment(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDepartmentDto: UpdateDepartmentDto
  ) {
    const department = await this.departmentService.updateDepartment(id, updateDepartmentDto);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department updated successfully',
      data: department
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete department (Admin only)' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Cannot delete department with active patients' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async deleteDepartment(@Param('id') id: string) {
    await this.departmentService.deleteDepartment(id);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department deleted successfully'
    };
  }

  @Get(':id/stats')
  @Roles('admin', 'doctor')
  @ApiOperation({ summary: 'Get specific department statistics' })
  @ApiResponse({ status: 200, description: 'Department statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async getDepartmentStats(@Param('id') departmentId: string, @Request() req: any) {
    // For doctors, only allow their own department unless admin
    const user = req.user;
    if (user.role === 'doctor' && user.department !== departmentId) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Access denied: You can only view your own department statistics'
      };
    }

    const stats = await this.departmentService.getDepartmentStats(departmentId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department statistics retrieved successfully',
      data: stats
    };
  }

  @Post('seed')
  @Roles('admin')
  @ApiOperation({ summary: 'Seed default departments (Admin only)' })
  @ApiResponse({ status: 201, description: 'Departments seeded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async seedDepartments() {
    await this.departmentService.seedDepartments();
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Departments seeded successfully'
    };
  }
}
