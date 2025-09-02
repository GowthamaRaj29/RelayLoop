import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreateMedicationDto, CreatePatientNoteDto } from './dto/create-medication.dto';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Patients')
// @ApiBearerAuth('JWT-auth')   // Temporarily disabled for testing
// @UseGuards(JwtAuthGuard, RolesGuard)   // Temporarily disabled for testing
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  // @Roles('admin', 'doctor', 'nurse')   // Temporarily disabled for testing
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Patient with MRN already exists' })
  async create(@Body() createPatientDto: CreatePatientDto, @Request() req?) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Patient created successfully',
      data: await this.patientService.create(createPatientDto),
    };
  }

  @Get('create-test-data')
  @ApiOperation({ summary: 'Create test patients for demonstration' })
  async createTestData() {
    const testPatients = [
      {
        first_name: 'John',
        last_name: 'Doe',
        mrn: 'MRN-TEST-001',
        dob: '1980-01-15',
        gender: 'Male',
        phone: '123-456-7890',
        email: 'john.doe@test.com',
        address: '123 Test St',
        department: 'Oncology',
        attending_doctor: 'Dr. Smith',
        medical_conditions: ['Diabetes'],
        allergies: ['None'],
        status: 'Active'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        mrn: 'MRN-TEST-002',
        dob: '1990-05-20',
        gender: 'Female',
        phone: '123-456-7891',
        email: 'jane.smith@test.com',
        address: '456 Test Ave',
        department: 'Oncology',
        attending_doctor: 'Dr. Johnson',
        medical_conditions: ['Hypertension'],
        allergies: ['Penicillin'],
        status: 'Active'
      },
      {
        first_name: 'Bob',
        last_name: 'Wilson',
        mrn: 'MRN-TEST-003',
        dob: '1975-12-10',
        gender: 'Male',
        phone: '123-456-7892',
        email: 'bob.wilson@test.com',
        address: '789 Test Blvd',
        department: 'Cardiology',
        attending_doctor: 'Dr. Brown',
        medical_conditions: ['Heart Disease'],
        allergies: ['Shellfish'],
        status: 'Active'
      }
    ];

    const results = [];
    for (const patient of testPatients) {
      try {
        const created = await this.patientService.create(patient);
        results.push(created);
      } catch (error) {
        console.log(`Patient ${patient.mrn} might already exist:`, error.message);
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Test data creation completed',
      data: {
        created: results.length,
        patients: results
      }
    };
  }

  @Get()
  // @Roles('admin', 'doctor', 'nurse')   // Temporarily disabled for testing
  @ApiOperation({ summary: 'Get all patients with optional filtering' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter by department' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, MRN, or email' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of patients to return', type: 'number' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of patients to skip', type: 'number' })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully' })
  async findAll(
    @Query('department') department?: string,
    @Query('search') search?: string,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Request() req?
  ) {
    // Temporarily disable department filtering to show all patients
    console.log('GET /patients called with params:', { department, search, limit, offset });
    console.log('Request user:', req?.user || 'No user (auth disabled)');
    
    // Remove department filtering for now to debug
    const result = await this.patientService.findAll(undefined, search, limit, offset);
    
    console.log('Service result:', {
      totalPatients: result.total,
      returnedCount: result.patients?.length,
      patients: result.patients?.map(p => ({ id: p.id, name: `${p.first_name} ${p.last_name}`, department: p.department }))
    });
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patients retrieved successfully',
      data: result.patients,
      meta: {
        total: result.total,
        limit,
        offset,
        hasMore: (offset + limit) < result.total
      }
    };
  }

  @Get('stats')
  // @Roles('admin', 'doctor')   // Temporarily disabled for testing
  @ApiOperation({ summary: 'Get patient statistics (Admin and Doctor access)' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter stats by department' })
  @ApiResponse({ status: 200, description: 'Patient statistics retrieved successfully' })
  async getStats(@Query('department') department?: string, @Request() req?) {
    // For doctors, restrict to their department unless admin
    const userDepartment = req?.user?.role === 'admin' ? department : req?.user?.department;
    
    const stats = await this.patientService.getPatientStats(userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient statistics retrieved successfully',
      data: stats
    };
  }

  @Get(':id')
  // @Roles('admin', 'doctor', 'nurse')   // Temporarily disabled for testing
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async findOne(@Param('id') id: string, @Request() req?) {
    console.log('GET /patients/:id called with ID:', id);
    console.log('Request user:', req?.user || 'No user (auth disabled)');
    
    // Temporarily disable department checking for testing
    const userDepartment = undefined; // req?.user?.role === 'admin' ? undefined : req?.user?.department;
    const patient = await this.patientService.findOne(id, userDepartment);
    
    console.log('Retrieved patient:', { 
      id: patient.id, 
      name: `${patient.first_name} ${patient.last_name}`, 
      department: patient.department 
    });
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient retrieved successfully',
      data: patient
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async update(
    @Param('id') id: string, 
    @Body() updatePatientDto: UpdatePatientDto,
    @Request() req?
  ) {
    console.log('PATCH /patients/:id called with ID:', id);
    console.log('Update data:', updatePatientDto);
    console.log('Request user:', req?.user || 'No user (auth disabled)');
    
    const userDepartment = undefined; // Temporarily disable department checking
    const patient = await this.patientService.update(id, updatePatientDto, userDepartment);
    
    console.log('Updated patient:', { 
      id: patient.id, 
      name: `${patient.first_name} ${patient.last_name}` 
    });
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient updated successfully',
      data: patient
    };
  }

  @Delete(':id')
  // @Roles('admin')   // Temporarily disabled for testing
  @ApiOperation({ summary: 'Delete a patient (Admin only)' })
  @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async remove(@Param('id') id: string) {
    await this.patientService.remove(id);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient deleted successfully'
    };
  }

  // Medication endpoints
  @Post(':id/medications')
  // @Roles('admin', 'doctor', 'nurse')   // Temporarily disabled for testing
  @ApiOperation({ summary: 'Add medication to a patient' })
  @ApiResponse({ status: 201, description: 'Medication added successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async addMedication(
    @Param('id') patientId: string,
    @Body() createMedicationDto: CreateMedicationDto,
    @Request() req?
  ) {
    createMedicationDto.patient_id = patientId;
    const userDepartment = req?.user?.role === 'admin' ? undefined : req?.user?.department;
    
    const medication = await this.patientService.addMedication(createMedicationDto, userDepartment);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Medication added successfully',
      data: medication
    };
  }

  // Patient notes endpoints
  @Post(':id/notes')
  // @Roles('admin', 'doctor', 'nurse')   // Temporarily disabled for testing
  @ApiOperation({ summary: 'Add a note to a patient' })
  @ApiResponse({ status: 201, description: 'Note added successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async addNote(
    @Param('id') patientId: string,
    @Body() createPatientNoteDto: CreatePatientNoteDto,
    @Request() req?
  ) {
    createPatientNoteDto.patient_id = patientId;
    const userDepartment = req?.user?.role === 'admin' ? undefined : req?.user?.department;
    
    const note = await this.patientService.addNote(createPatientNoteDto, userDepartment);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Note added successfully',
      data: note
    };
  }

  // ML Prediction endpoints
  @Post(':id/predictions')
  @ApiOperation({ summary: 'Create ML readmission prediction for a patient' })
  @ApiResponse({ status: 201, description: 'Prediction created successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async createPrediction(
    @Param('id') patientId: string,
    @Body() createPredictionDto: CreatePredictionDto,
    @Request() req?
  ) {
    createPredictionDto.patient_id = patientId;
    const userDepartment = req?.user?.role === 'admin' ? undefined : req?.user?.department;
    
    const prediction = await this.patientService.createPrediction(createPredictionDto, userDepartment);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Prediction created successfully',
      data: prediction
    };
  }

  @Get(':id/predictions')
  @ApiOperation({ summary: 'Get all predictions for a patient' })
  @ApiResponse({ status: 200, description: 'Predictions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientPredictions(
    @Param('id') patientId: string,
    @Request() req?
  ) {
    const userDepartment = req?.user?.role === 'admin' ? undefined : req?.user?.department;
    
    const predictions = await this.patientService.getPatientPredictions(patientId, userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Predictions retrieved successfully',
      data: predictions
    };
  }

  @Get('predictions/department')
  @ApiOperation({ summary: 'Get all predictions for a department' })
  @ApiResponse({ status: 200, description: 'Department predictions retrieved successfully' })
  @ApiQuery({ name: 'department', required: false, description: 'Department name' })
  async getDepartmentPredictions(
    @Query('department') department?: string,
    @Request() req?
  ) {
    const userDepartment = req?.user?.role === 'admin' ? department : req?.user?.department;
    
    const predictions = await this.patientService.getDepartmentPredictions(userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department predictions retrieved successfully',
      data: predictions
    };
  }
}
