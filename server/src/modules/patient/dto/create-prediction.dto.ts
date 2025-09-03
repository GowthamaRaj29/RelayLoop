import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePredictionDto {
  @ApiProperty({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Doctor who performed the prediction', example: 'Dr. Smith' })
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  // Enhanced lab values and clinical data required by ML model
  @ApiProperty({ description: 'Chronic conditions - Diabetes', example: 0 })
  @IsNumber()
  diabetes: number;

  @ApiProperty({ description: 'Chronic conditions - Hypertension', example: 0 })
  @IsNumber()
  hypertension: number;

  @ApiProperty({ description: 'Chronic conditions - Heart Disease', example: 0 })
  @IsNumber()
  heart_disease: number;

  @ApiProperty({ description: 'Chronic conditions - Kidney Disease', example: 0 })
  @IsNumber()
  kidney_disease: number;

  @ApiProperty({ description: 'Chronic conditions - Respiratory Disease', example: 0 })
  @IsNumber()
  respiratory_disease: number;

  // Hospital admission types
  @ApiProperty({ description: 'Regular ward admission', example: 1 })
  @IsNumber()
  regular_ward_admission: number;

  @ApiProperty({ description: 'Semi-intensive unit admission', example: 0 })
  @IsNumber()
  semi_intensive_unit_admission: number;

  @ApiProperty({ description: 'Intensive care unit admission', example: 0 })
  @IsNumber()
  intensive_care_unit_admission: number;

  // Lab values
  @ApiProperty({ description: 'Hemoglobin level (g/dL)', example: 13.5 })
  @IsNumber()
  hemoglobin: number;

  @ApiProperty({ description: 'Hematocrit level (%)', example: 40.5 })
  @IsNumber()
  hematocrit: number;

  @ApiProperty({ description: 'Platelets count (x10³/μL)', example: 275 })
  @IsNumber()
  platelets: number;

  @ApiProperty({ description: 'Red blood cells count (x10⁶/μL)', example: 4.8 })
  @IsNumber()
  red_blood_cells: number;

  @ApiProperty({ description: 'Lymphocytes count (x10³/μL)', example: 2.2 })
  @IsNumber()
  lymphocytes: number;

  @ApiProperty({ description: 'Urea level (mmol/L)', example: 5.2 })
  @IsNumber()
  urea: number;

  @ApiProperty({ description: 'Potassium level (mmol/L)', example: 4.1 })
  @IsNumber()
  potassium: number;

  @ApiProperty({ description: 'Sodium level (mmol/L)', example: 140 })
  @IsNumber()
  sodium: number;

  // Other clinical factors
  @ApiProperty({ description: 'SARS-CoV-2 exam result', example: 0 })
  @IsNumber()
  sars_cov2_exam_result: number;

  @ApiProperty({ description: 'Length of stay (days)', example: 5 })
  @IsNumber()
  length_of_stay: number;

  @ApiProperty({ description: 'Number of medications', example: 8 })
  @IsNumber()
  num_medications: number;

  @ApiProperty({ description: 'Previous admissions count', example: 1 })
  @IsNumber()
  previous_admissions: number;
}

export class PredictionResultDto {
  @ApiProperty({ description: 'Prediction ID' })
  id: string;

  @ApiProperty({ description: 'Patient ID' })
  patient_id: string;

  @ApiProperty({ description: 'Doctor ID' })
  doctor_id: string;

  @ApiProperty({ description: 'Risk level', enum: ['low', 'medium', 'high'] })
  risk_level: string;

  @ApiProperty({ description: 'Risk percentage (0-100)' })
  risk_percentage: number;

  @ApiProperty({ description: 'ML probability (0-100)' })
  ml_probability: number;

  @ApiProperty({ description: 'Clinical score (0-100)' })
  clinical_score: number;

  @ApiProperty({ description: 'Age multiplier' })
  age_multiplier: number;

  @ApiProperty({ description: 'Risk factors identified' })
  risk_factors: string[];

  @ApiProperty({ description: 'Clinical recommendation' })
  recommendation: string;

  @ApiProperty({ description: 'Confidence score (0-100)' })
  confidence: number;

  @ApiProperty({ description: 'Age group' })
  age_group: string;

  @ApiProperty({ description: 'Prediction timestamp' })
  predicted_at: string;

  // Note: input_data temporarily removed due to database schema mismatch
  // @ApiProperty({ description: 'All input data used for prediction' })
  // input_data: object;
}
