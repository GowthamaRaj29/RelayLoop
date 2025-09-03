import { 
	Controller, 
	Get, 
	Post, 
	Put, 
	Delete, 
	Param, 
	Body, 
	UseGuards, 
	HttpStatus,
	ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Departments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentController {
	constructor(private readonly departmentService: DepartmentService) {}

	@Post()
	@Roles('admin')
	@ApiOperation({ summary: 'Create a new department' })
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
	@ApiOperation({ summary: 'Get all departments' })
	async getDepartments() {
		const departments = await this.departmentService.getDepartments();
		return {
			statusCode: HttpStatus.OK,
			message: 'Departments retrieved successfully',
			data: departments
		};
	}

	@Get(':id')
	@Roles('admin', 'doctor', 'nurse')
	@ApiOperation({ summary: 'Get department by ID' })
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
	@ApiOperation({ summary: 'Update department' })
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
	@ApiOperation({ summary: 'Delete department' })
	async deleteDepartment(@Param('id') id: string) {
		await this.departmentService.deleteDepartment(id);
		return {
			statusCode: HttpStatus.OK,
			message: 'Department deleted successfully'
		};
	}

	@Get('stats/all')
	@Roles('admin')
	@ApiOperation({ summary: 'Get all department statistics' })
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
	async getDepartmentStats(@Param('id') departmentId: string) {
		const stats = await this.departmentService.getDepartmentStats(departmentId);
		return {
			statusCode: HttpStatus.OK,
			message: 'Department statistics retrieved successfully',
			data: stats
		};
	}

	@Post('seed')
	@Roles('admin')
	@ApiOperation({ summary: 'Seed default departments' })
	async seedDepartments() {
		await this.departmentService.seedDepartments();
		return {
			statusCode: HttpStatus.CREATED,
			message: 'Departments seeded successfully'
		};
	}
}
