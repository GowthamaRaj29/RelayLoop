import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreateMedicationDto, CreatePatientNoteDto } from './dto/create-medication.dto';
import { CreatePredictionDto, PredictionResultDto } from './dto/create-prediction.dto';
import { MLPredictionService } from './ml-prediction.service';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mlPredictionService: MLPredictionService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();
      
      // Check if MRN already exists
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('mrn', createPatientDto.mrn)
        .maybeSingle();

      if (existingPatient) {
        throw new BadRequestException(`Patient with MRN ${createPatientDto.mrn} already exists`);
      }

      const patientData = {
        ...createPatientDto,
        dob: createPatientDto.dob,
        last_admission: createPatientDto.last_admission || null,
        last_visit: createPatientDto.last_visit || null,
        medical_conditions: createPatientDto.medical_conditions || [],
        allergies: createPatientDto.allergies || [],
        status: createPatientDto.status || 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: savedPatient, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating patient: ${error.message}`);
        throw new BadRequestException(`Failed to create patient: ${error.message}`);
      }

      this.logger.log(`Created patient with ID: ${savedPatient.id}`);
      return savedPatient;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error creating patient: ${error.message}`);
      throw new BadRequestException('Failed to create patient');
    }
  }

  async findAll(department?: string, search?: string, limit: number = 50, offset: number = 0): Promise<{ patients: any[], total: number }> {
    try {
      const supabase = this.supabaseService.getClient();
      
      // Fix NaN offset issue
      const safeLimit = isNaN(limit) ? 50 : limit;
      const safeOffset = isNaN(offset) ? 0 : offset;
      
      // Debug logging
      this.logger.log(`findAll called with department: ${department}, search: ${search}, limit: ${safeLimit}, offset: ${safeOffset}`);
      
      let query = supabase.from('patients').select('*', { count: 'exact' });

      // Apply department filter if provided
      if (department) {
        this.logger.log(`Filtering by department: ${department}`);
        query = query.eq('department', department);
      } else {
        this.logger.log('No department filter applied');
      }

      // Apply search filter if provided
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,mrn.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Apply pagination and ordering - remove range for now to debug
      query = query.order('created_at', { ascending: false });
      
      // Don't apply range if we want to see all results
      if (safeLimit > 0) {
        query = query.range(safeOffset, safeOffset + safeLimit - 1);
      }

      const { data: patients, error, count } = await query;
      
      // Debug logging
      this.logger.log(`Query result - count: ${count}, patients length: ${patients?.length}, error: ${error?.message}`);
      if (patients && patients.length > 0) {
        this.logger.log(`First patient: ${JSON.stringify(patients[0])}`);
      } else {
        this.logger.log(`No patients returned. Full query executed without range.`);
        // Try a simple query without any filtering to see what's in the database
        const { data: allPatients, error: allError } = await supabase.from('patients').select('*').limit(5);
        this.logger.log(`Sample query - patients: ${allPatients?.length}, error: ${allError?.message}`);
        if (allPatients && allPatients.length > 0) {
          this.logger.log(`Sample patient: ${JSON.stringify(allPatients[0])}`);
        }
      }

      if (error) {
        this.logger.error(`Error finding patients: ${error.message}`);
        throw new BadRequestException(`Failed to find patients: ${error.message}`);
      }

      return { patients: patients || [], total: count || 0 };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error finding patients: ${error.message}`);
      throw new BadRequestException('Failed to find patients');
    }
  }

  async findOne(id: string, userDepartment?: string): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();
      
      console.log(`Finding patient with ID: ${id}, userDepartment: ${userDepartment}`);
      
      let query = supabase
        .from('patients')
        .select('*')
        .eq('id', id);

      if (userDepartment) {
        query = query.eq('department', userDepartment);
      }

      const { data: patient, error } = await query.single();

      if (error || !patient) {
        console.log(`Patient not found - Error: ${error?.message}`);
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      console.log(`Found patient: ${patient.first_name} ${patient.last_name} (${patient.department})`);

      // Fetch related vital signs data
      const { data: vitalSigns, error: vitalError } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', id)
        .order('created_at', { ascending: false })
        .limit(10); // Get latest 10 vital signs

      if (vitalError) {
        console.log(`Error fetching vital signs: ${vitalError.message}`);
        // Don't fail the request if vital signs fetch fails
      }

      console.log(`Found ${vitalSigns?.length || 0} vital sign records`);

      // Fetch related medications data
      const { data: medications, error: medicationError } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', id)
        .order('created_at', { ascending: false });

      if (medicationError) {
        console.log(`Error fetching medications: ${medicationError.message}`);
      }

      console.log(`Found ${medications?.length || 0} medication records`);

      // Fetch related notes data
      const { data: notes, error: notesError } = await supabase
        .from('patient_notes')
        .select('*')
        .eq('patient_id', id)
        .order('date', { ascending: false });

      if (notesError) {
        console.log(`Error fetching notes: ${notesError.message}`);
      }

      console.log(`Found ${notes?.length || 0} note records`);

      // Add vital signs to patient data
      const patientWithVitals = {
        ...patient,
        vitals: vitalSigns || [],
        medications: medications || [],
        notes_history: notes || []
      };

      return patientWithVitals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Unexpected error finding patient: ${error.message}`);
      throw new BadRequestException('Failed to find patient');
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto, userDepartment?: string): Promise<any> {
    try {
      // First verify patient exists and user has access
      await this.findOne(id, userDepartment);

      const supabase = this.supabaseService.getClient();
      
      const updateData = {
        ...updatePatientDto,
        updated_at: new Date().toISOString()
      };

      const { data: updatedPatient, error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error updating patient: ${error.message}`);
        throw new BadRequestException(`Failed to update patient: ${error.message}`);
      }

      this.logger.log(`Updated patient with ID: ${id}`);
      return updatedPatient;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error updating patient: ${error.message}`);
      throw new BadRequestException('Failed to update patient');
    }
  }

  async remove(id: string, userDepartment?: string): Promise<void> {
    try {
      // First verify patient exists and user has access
      await this.findOne(id, userDepartment);

      const supabase = this.supabaseService.getClient();
      
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting patient: ${error.message}`);
        throw new BadRequestException(`Failed to delete patient: ${error.message}`);
      }

      this.logger.log(`Deleted patient with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error deleting patient: ${error.message}`);
      throw new BadRequestException('Failed to delete patient');
    }
  }

  async addMedication(createMedicationDto: CreateMedicationDto, userDepartment?: string): Promise<any> {
    try {
      // Verify patient exists and user has access
      await this.findOne(createMedicationDto.patient_id, userDepartment);

      const supabase = this.supabaseService.getClient();
      
      const medicationData = {
        ...createMedicationDto,
        prescribed_by: createMedicationDto.added_by
      };
      
      // Remove added_by since database expects prescribed_by
      delete medicationData.added_by;

      const { data: savedMedication, error } = await supabase
        .from('medications')
        .insert(medicationData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error adding medication: ${error.message}`);
        throw new BadRequestException(`Failed to add medication: ${error.message}`);
      }

      this.logger.log(`Added medication for patient: ${createMedicationDto.patient_id}`);
      return savedMedication;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error adding medication: ${error.message}`);
      throw new BadRequestException('Failed to add medication');
    }
  }

  async addNote(createPatientNoteDto: CreatePatientNoteDto, userDepartment?: string): Promise<any> {
    try {
      // Verify patient exists and user has access
      await this.findOne(createPatientNoteDto.patient_id, userDepartment);

      const supabase = this.supabaseService.getClient();
      
      const noteData = {
        ...createPatientNoteDto,
        date: createPatientNoteDto.date || new Date().toISOString().split('T')[0] // Add current date if not provided
      };

      const { data: savedNote, error } = await supabase
        .from('patient_notes')
        .insert(noteData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error adding note: ${error.message}`);
        throw new BadRequestException(`Failed to add note: ${error.message}`);
      }

      this.logger.log(`Added note for patient: ${createPatientNoteDto.patient_id}`);
      return savedNote;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error adding note: ${error.message}`);
      throw new BadRequestException('Failed to add note');
    }
  }

  async getPatientMedications(patientId: string, userDepartment?: string): Promise<any[]> {
    try {
      // Verify patient exists and user has access
      await this.findOne(patientId, userDepartment);

      const supabase = this.supabaseService.getClient();
      
      const { data: medications, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error getting medications: ${error.message}`);
        throw new BadRequestException(`Failed to get medications: ${error.message}`);
      }

      return medications || [];
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error getting medications: ${error.message}`);
      throw new BadRequestException('Failed to get medications');
    }
  }

  async getPatientNotes(patientId: string, userDepartment?: string): Promise<any[]> {
    try {
      // Verify patient exists and user has access
      await this.findOne(patientId, userDepartment);

      const supabase = this.supabaseService.getClient();
      
      const { data: notes, error } = await supabase
        .from('patient_notes')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error getting notes: ${error.message}`);
        throw new BadRequestException(`Failed to get notes: ${error.message}`);
      }

      return notes || [];
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error getting notes: ${error.message}`);
      throw new BadRequestException('Failed to get notes');
    }
  }

  async getPatientStats(department?: string): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();
      
      let query = supabase.from('patients').select('*', { count: 'exact', head: true });
      if (department) {
        query = query.eq('department_id', department);
      }
      
      const { count: totalPatients, error: totalError } = await query;
      
      if (totalError) {
        throw new BadRequestException(`Failed to get total patients: ${totalError.message}`);
      }

      // Active patients
      let activeQuery = supabase.from('patients').select('*', { count: 'exact', head: true }).eq('status', 'Active');
      if (department) {
        activeQuery = activeQuery.eq('department_id', department);
      }
      
      const { count: activePatients, error: activeError } = await activeQuery;
      
      if (activeError) {
        throw new BadRequestException(`Failed to get active patients: ${activeError.message}`);
      }

      // Recent admissions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let recentQuery = supabase.from('patients').select('*', { count: 'exact', head: true })
        .gte('last_admission', thirtyDaysAgo.toISOString());
      if (department) {
        recentQuery = recentQuery.eq('department_id', department);
      }
      
      const { count: recentAdmissions, error: recentError } = await recentQuery;
      
      if (recentError) {
        this.logger.warn(`Failed to get recent admissions: ${recentError.message}`);
      }

      return {
        totalPatients: totalPatients || 0,
        activePatients: activePatients || 0,
        recentAdmissions: recentAdmissions || 0,
        departmentStats: []
      };
    } catch (error) {
      this.logger.error(`Failed to get patient stats: ${error.message}`);
      throw new BadRequestException('Failed to get patient statistics');
    }
  }

  // ML Prediction methods
  async createPrediction(patientId: string, predictionData: CreatePredictionDto): Promise<PredictionResultDto> {
    try {
      // Verify patient exists and get patient data
      const patient = await this.findOne(patientId);

      // Add calculated age and other patient details to patient object
      const patientWithCalculatedData = {
        ...patient,
        age: this.calculateAge(patient.dob),
        patient_age: this.calculateAge(patient.dob),
        patient_gender: patient.gender,
        department: patient.department
      };

      // Add patient ID to prediction data
      const completeData: CreatePredictionDto = {
        ...predictionData,
        patient_id: patientId,
      };

      // Use the ML prediction service to create and store the prediction
      const predictionResult = await this.mlPredictionService.predictReadmissionRisk(patientWithCalculatedData, completeData);

      this.logger.log(`Created and stored ML prediction for patient: ${patientId}`);
      return predictionResult;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error creating prediction: ${error.message}`);
      throw new BadRequestException('Failed to create prediction');
    }
  }

  private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  async getPatientPredictions(patientId: string, userDepartment?: string): Promise<PredictionResultDto[]> {
    try {
      // Verify patient exists and user has access
      await this.findOne(patientId, userDepartment);

      // Get predictions from the ML prediction service
      return await this.mlPredictionService.getPatientPredictions(patientId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Unexpected error fetching patient predictions: ${error.message}`);
      throw new BadRequestException('Failed to fetch predictions');
    }
  }

  async getLatestPrediction(patientId: string, userDepartment?: string): Promise<PredictionResultDto | null> {
    try {
      // Verify patient exists and user has access
      await this.findOne(patientId, userDepartment);

      // Get latest prediction from the ML prediction service
      return await this.mlPredictionService.getLatestPrediction(patientId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Unexpected error fetching latest prediction: ${error.message}`);
      throw new BadRequestException('Failed to fetch latest prediction');
    }
  }

  async getDepartmentPredictions(department?: string): Promise<any[]> {
    try {
      // Get department predictions from the ML prediction service
      return await this.mlPredictionService.getDepartmentPredictions(department);
    } catch (error) {
      this.logger.error(`Unexpected error fetching department predictions: ${error.message}`);
      throw new BadRequestException('Failed to fetch department predictions');
    }
  }
}
