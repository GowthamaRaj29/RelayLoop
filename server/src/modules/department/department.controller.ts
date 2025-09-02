import { Controller, Get, Param, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Departments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

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

  @Get(':id/stats')
  @Roles('admin', 'doctor')
  @ApiOperation({ summary: 'Get specific department statistics' })
  @ApiResponse({ status: 200, description: 'Department statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async getDepartmentStats(@Param('id') departmentId: string, @Request() req) {
    // For doctors, only allow their own department unless admin
    const userDepartment = req.user?.role === 'admin' ? departmentId : req.user?.department;
    
    if (req.user?.role !== 'admin' && userDepartment !== departmentId) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Access denied - can only view your department statistics',
        data: null
      };
    }

    const stats = await this.departmentService.getDepartmentStats(departmentId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department statistics retrieved successfully',
      data: stats
    };
  }
}
