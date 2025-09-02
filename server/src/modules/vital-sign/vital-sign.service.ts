import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { UpdateVitalSignDto } from './dto/update-vital-sign.dto';

@Injectable()
export class VitalSignService {
  private readonly logger = new Logger(VitalSignService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  async create(createVitalSignDto: CreateVitalSignDto, userDepartment?: string): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();

      console.log('Creating vital signs for patient:', createVitalSignDto.patient_id);
      console.log('Vital sign data:', createVitalSignDto);

      // Verify patient exists - temporarily disable department checking
      const patientQuery = supabase
        .from('patients')
        .select('id, department')
        .eq('id', createVitalSignDto.patient_id);

      // Temporarily disable department filtering
      // if (userDepartment) {
      //   patientQuery = patientQuery.eq('department', userDepartment);
      // }

      const { data: patient, error: patientError } = await patientQuery.single();

      if (patientError || !patient) {
        console.log('Patient verification failed:', patientError?.message);
        throw new NotFoundException(`Patient with ID ${createVitalSignDto.patient_id} not found`);
      }

      console.log('Patient verified:', patient);

      const vitalSignData = {
        ...createVitalSignDto,
        recorded_at: new Date().toISOString()
      };

      const { data: savedVitalSign, error } = await supabase
        .from('vital_signs')
        .insert(vitalSignData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating vital signs: ${error.message}`);
        console.log('Full error:', error);
        throw new BadRequestException(`Failed to create vital signs: ${error.message}`);
      }

      console.log('Vital signs created successfully:', savedVitalSign);
      this.logger.log(`Created vital signs for patient ${createVitalSignDto.patient_id}`);
      return savedVitalSign;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error creating vital signs: ${error.message}`);
      console.log('Unexpected error:', error);
      throw new BadRequestException('Failed to create vital signs');
    }
  }

  async findByPatient(
    patientId: string,
    userDepartment?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ vitalSigns: any[], total: number }> {
    try {
      const supabase = this.supabaseService.getClient();

      // Verify patient exists and user has access
      let patientQuery = supabase
        .from('patients')
        .select('id, department_id')
        .eq('id', patientId);

      if (userDepartment) {
        patientQuery = patientQuery.eq('department_id', userDepartment);
      }

      const { data: patient, error: patientError } = await patientQuery.single();

      if (patientError || !patient) {
        throw new NotFoundException(`Patient with ID ${patientId} not found`);
      }

      // Get vital signs for the patient
      const { data: vitalSigns, error, count } = await supabase
        .from('vital_signs')
        .select('*', { count: 'exact' })
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        this.logger.error(`Error finding vital signs: ${error.message}`);
        throw new BadRequestException(`Failed to find vital signs: ${error.message}`);
      }

      return { vitalSigns: vitalSigns || [], total: count || 0 };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error finding vital signs: ${error.message}`);
      throw new BadRequestException('Failed to find vital signs');
    }
  }

  async findAll(
    department?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ vitalSigns: any[], total: number }> {
    try {
      const supabase = this.supabaseService.getClient();
      
      let query = supabase
        .from('vital_signs')
        .select('*, patients!inner(id, first_name, last_name, mrn, department_id)', { count: 'exact' });

      // Apply department filter if provided
      if (department) {
        query = query.eq('patients.department_id', department);
      }

      // Apply pagination and ordering
      query = query
        .range(offset, offset + limit - 1)
        .order('recorded_at', { ascending: false });

      const { data: vitalSigns, error, count } = await query;

      if (error) {
        this.logger.error(`Error finding all vital signs: ${error.message}`);
        throw new BadRequestException(`Failed to find vital signs: ${error.message}`);
      }

      return { vitalSigns: vitalSigns || [], total: count || 0 };
    } catch (error) {
      this.logger.error(`Unexpected error finding all vital signs: ${error.message}`);
      throw new BadRequestException('Failed to find vital signs');
    }
  }

  async findOne(id: string, userDepartment?: string): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();
      
      console.log('Finding vital sign with ID:', id);
      
      // Simplified query without department restrictions for testing
      const { data: vitalSign, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !vitalSign) {
        console.log('Vital sign not found:', error?.message);
        throw new NotFoundException(`Vital signs with ID ${id} not found`);
      }

      console.log('Found vital sign:', vitalSign);
      return vitalSign;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Unexpected error finding vital sign: ${error.message}`);
      throw new BadRequestException('Failed to find vital sign');
    }
  }

  async update(id: string, updateVitalSignDto: UpdateVitalSignDto, userDepartment?: string): Promise<any> {
    try {
      console.log('Updating vital signs with ID:', id);
      console.log('Update data:', updateVitalSignDto);
      
      // First verify vital sign exists and user has access (temporarily disabled department check)
      await this.findOne(id, undefined);

      const supabase = this.supabaseService.getClient();
      
      const updateData = {
        ...updateVitalSignDto
      };

      console.log('Sending update to database:', updateData);

      const { data: updatedVitalSign, error } = await supabase
        .from('vital_signs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error updating vital signs: ${error.message}`);
        console.log('Update error:', error);
        throw new BadRequestException(`Failed to update vital signs: ${error.message}`);
      }

      console.log('Updated vital signs successfully:', updatedVitalSign);
      this.logger.log(`Updated vital signs with ID: ${id}`);
      return updatedVitalSign;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error updating vital signs: ${error.message}`);
      console.log('Unexpected update error:', error);
      throw new BadRequestException('Failed to update vital signs');
    }
  }

  async remove(id: string, userDepartment?: string): Promise<void> {
    try {
      // First verify vital sign exists and user has access
      await this.findOne(id, userDepartment);

      const supabase = this.supabaseService.getClient();
      
      const { error } = await supabase
        .from('vital_signs')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting vital signs: ${error.message}`);
        throw new BadRequestException(`Failed to delete vital signs: ${error.message}`);
      }

      this.logger.log(`Deleted vital signs with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error deleting vital signs: ${error.message}`);
      throw new BadRequestException('Failed to delete vital signs');
    }
  }

  async getLatestVitalSigns(patientId: string, userDepartment?: string): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();

      // Verify patient exists and user has access
      let patientQuery = supabase
        .from('patients')
        .select('id, department_id')
        .eq('id', patientId);

      if (userDepartment) {
        patientQuery = patientQuery.eq('department_id', userDepartment);
      }

      const { data: patient, error: patientError } = await patientQuery.single();

      if (patientError || !patient) {
        throw new NotFoundException(`Patient with ID ${patientId} not found`);
      }

      // Get the latest vital signs for the patient
      const { data: latestVitalSigns, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        this.logger.error(`Error finding latest vital signs: ${error.message}`);
        throw new BadRequestException(`Failed to find latest vital signs: ${error.message}`);
      }

      return latestVitalSigns;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error finding latest vital signs: ${error.message}`);
      throw new BadRequestException('Failed to find latest vital signs');
    }
  }

  async getVitalSignsStats(department?: string): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();

      // Get total vital signs count
      let totalQuery = supabase.from('vital_signs').select('*', { count: 'exact', head: true });
      
      if (department) {
        totalQuery = totalQuery
          .eq('patients.department_id', department);
      }

      const { count: totalVitalSigns, error: totalError } = await totalQuery;

      if (totalError) {
        throw new BadRequestException(`Failed to get total vital signs: ${totalError.message}`);
      }

      // Get today's vital signs count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let todayQuery = supabase.from('vital_signs')
        .select('*', { count: 'exact', head: true })
        .gte('recorded_at', today.toISOString());

      if (department) {
        todayQuery = todayQuery
          .eq('patients.department_id', department);
      }

      const { count: todayVitalSigns, error: todayError } = await todayQuery;

      if (todayError) {
        this.logger.warn(`Failed to get today's vital signs: ${todayError.message}`);
      }

      return {
        totalVitalSigns: totalVitalSigns || 0,
        todayVitalSigns: todayVitalSigns || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to get vital signs stats: ${error.message}`);
      throw new BadRequestException('Failed to get vital signs statistics');
    }
  }
}
