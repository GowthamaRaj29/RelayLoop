import { Injectable, Logger } from '@nestjs/common';
import { CreatePredictionDto, PredictionResultDto } from './dto/create-prediction.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MLPredictionService {
  private readonly logger = new Logger(MLPredictionService.name);

  // Age ranges and risk multipliers from the Python model
  private readonly ageRanges = {
    'Young_Adult': [18, 35],
    'Middle_Adult': [36, 50], 
    'Mature_Adult': [51, 65],
    'Senior': [66, 80],
    'Elderly': [81, 95]
  };

  private readonly ageRiskMultipliers = {
    'Young_Adult': 1.0,
    'Middle_Adult': 1.2,
    'Mature_Adult': 1.4,
    'Senior': 1.7,
    'Elderly': 2.1
  };

  // Clinical risk weights from the Python model
  private readonly clinicalWeights = {
    age_elderly: 0.12,
    age_senior: 0.08,
    diabetes: 0.10,
    hypertension: 0.08,
    heart_disease: 0.12,
    kidney_disease: 0.15,
    respiratory_disease: 0.12,
    icu_admission: 0.20,
    semi_intensive_admission: 0.15,
    regular_ward_admission: 0.05,
    long_stay: 0.10,
    low_hemoglobin: 0.08,
    abnormal_hematocrit: 0.06,
    low_platelets: 0.10,
    abnormal_rbc: 0.06,
    low_lymphocytes: 0.08,
    high_urea: 0.10,
    electrolyte_imbalance: 0.08,
    covid_positive: 0.15,
    frequent_admissions: 0.12,
    high_medications: 0.08,
    multiple_comorbidities: 0.18
  };

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Standardize age group based on patient age
   */
  private standardizeAgeGroup(age: number): string {
    if (!age || age < 18) return 'Unknown';
    
    for (const [group, [min, max]] of Object.entries(this.ageRanges)) {
      if (age >= min && age <= max) {
        return group;
      }
    }
    return 'Unknown';
  }

  /**
   * Calculate comprehensive clinical risk score
   */
  private calculateClinicalScore(patient: any, predictionData: CreatePredictionDto): { score: number, riskFactors: string[] } {
    let riskScore = 0.0;
    const riskFactors: string[] = [];

    // Age factors
    const ageGroup = this.standardizeAgeGroup(patient.age || this.calculateAge(patient.dob));
    if (ageGroup === 'Elderly') {
      riskScore += this.clinicalWeights.age_elderly;
      riskFactors.push('Advanced age (80+ years) - very high risk');
    } else if (ageGroup === 'Senior') {
      riskScore += this.clinicalWeights.age_senior;
      riskFactors.push('Senior age (65-80 years) - increased risk');
    }

    // Chronic conditions
    const conditions = {
      diabetes: 'Diabetes mellitus',
      hypertension: 'Hypertension', 
      heart_disease: 'Heart disease',
      kidney_disease: 'Kidney disease',
      respiratory_disease: 'Respiratory disease'
    };

    const activeConditions: string[] = [];
    for (const [condition, label] of Object.entries(conditions)) {
      if (predictionData[condition] === 1) {
        riskScore += this.clinicalWeights[condition] || 0.08;
        activeConditions.push(label);
      }
    }

    if (activeConditions.length >= 3) {
      riskScore += this.clinicalWeights.multiple_comorbidities;
      riskFactors.push(`Multiple comorbidities: ${activeConditions.join(', ')}`);
    } else if (activeConditions.length > 0) {
      riskFactors.push(...activeConditions);
    }

    // Hospital admission severity
    if (predictionData.intensive_care_unit_admission === 1) {
      riskScore += this.clinicalWeights.icu_admission;
      riskFactors.push('ICU admission - critical condition');
    } else if (predictionData.semi_intensive_unit_admission === 1) {
      riskScore += this.clinicalWeights.semi_intensive_admission;
      riskFactors.push('Semi-intensive unit admission');
    }

    // Lab abnormalities
    if (predictionData.hemoglobin < 12) {
      riskScore += this.clinicalWeights.low_hemoglobin;
      riskFactors.push(`Low hemoglobin (anemia): ${predictionData.hemoglobin} g/dL`);
    }

    if (predictionData.hematocrit < 35 || predictionData.hematocrit > 50) {
      riskScore += this.clinicalWeights.abnormal_hematocrit;
      riskFactors.push(`Abnormal hematocrit: ${predictionData.hematocrit}%`);
    }

    if (predictionData.platelets < 150) {
      riskScore += this.clinicalWeights.low_platelets;
      riskFactors.push(`Low platelets (thrombocytopenia): ${predictionData.platelets} x10³/μL`);
    }

    if (predictionData.red_blood_cells < 4.0 || predictionData.red_blood_cells > 6.0) {
      riskScore += this.clinicalWeights.abnormal_rbc;
      riskFactors.push(`Abnormal RBC count: ${predictionData.red_blood_cells} x10⁶/μL`);
    }

    if (predictionData.lymphocytes < 1.0) {
      riskScore += this.clinicalWeights.low_lymphocytes;
      riskFactors.push(`Low lymphocytes (immunocompromised): ${predictionData.lymphocytes} x10³/μL`);
    }

    if (predictionData.urea > 7.5) {
      riskScore += this.clinicalWeights.high_urea;
      riskFactors.push(`Elevated urea (kidney dysfunction): ${predictionData.urea} mmol/L`);
    }

    // Electrolyte imbalance
    if (predictionData.potassium < 3.5 || predictionData.potassium > 5.0 || 
        predictionData.sodium < 136 || predictionData.sodium > 145) {
      riskScore += this.clinicalWeights.electrolyte_imbalance;
      riskFactors.push(`Electrolyte imbalance (K: ${predictionData.potassium}, Na: ${predictionData.sodium})`);
    }

    // COVID-19
    if (predictionData.sars_cov2_exam_result === 1) {
      riskScore += this.clinicalWeights.covid_positive;
      riskFactors.push('COVID-19 positive');
    }

    // Length of stay
    if (predictionData.length_of_stay > 10) {
      riskScore += this.clinicalWeights.long_stay;
      riskFactors.push(`Extended hospitalization (${predictionData.length_of_stay} days)`);
    }

    // Frequent admissions
    if (predictionData.previous_admissions >= 2) {
      riskScore += this.clinicalWeights.frequent_admissions;
      riskFactors.push(`Frequent admissions (${predictionData.previous_admissions} in past year)`);
    }

    // High medication count
    if (predictionData.num_medications >= 10) {
      riskScore += this.clinicalWeights.high_medications;
      riskFactors.push(`Polypharmacy (${predictionData.num_medications} medications)`);
    }

    return { score: Math.min(riskScore, 1.0), riskFactors };
  }

  /**
   * Simulate ML model prediction (simplified version of the complex Python models)
   */
  private simulateMLPrediction(patient: any, predictionData: CreatePredictionDto): number {
    // This is a simplified version of the ML model from the Python code
    // In a real implementation, you would call the actual trained models
    
    let mlScore = 0.25; // Base probability

    // Age contribution
    const age = patient.age || this.calculateAge(patient.dob);
    if (age > 65) mlScore += 0.15;
    if (age > 80) mlScore += 0.10;

    // Comorbidity contribution
    const comorbidityCount = predictionData.diabetes + predictionData.hypertension + 
                           predictionData.heart_disease + predictionData.kidney_disease + 
                           predictionData.respiratory_disease;
    mlScore += comorbidityCount * 0.08;

    // ICU admission is a strong predictor
    if (predictionData.intensive_care_unit_admission === 1) {
      mlScore += 0.25;
    }

    // Lab values contribution
    if (predictionData.hemoglobin < 10) mlScore += 0.12;
    if (predictionData.platelets < 100) mlScore += 0.15;
    if (predictionData.urea > 15) mlScore += 0.18;

    // Length of stay
    if (predictionData.length_of_stay > 14) mlScore += 0.10;

    // Previous admissions
    mlScore += predictionData.previous_admissions * 0.05;

    return Math.min(mlScore, 0.95);
  }

  /**
   * Check for critical medical conditions
   */
  private hasCriticalConditions(predictionData: CreatePredictionDto): boolean {
    return predictionData.intensive_care_unit_admission === 1 ||
           predictionData.hemoglobin < 8 ||
           predictionData.platelets < 50 ||
           predictionData.urea > 20 ||
           predictionData.length_of_stay > 20 ||
           (predictionData.diabetes + predictionData.hypertension + 
            predictionData.heart_disease + predictionData.kidney_disease + 
            predictionData.respiratory_disease) >= 4;
  }

  /**
   * Get risk level from probability
   */
  private getRiskLevel(probability: number): string {
    if (probability >= 0.55) return 'high';
    if (probability >= 0.25) return 'medium';
    return 'low';
  }

  /**
   * Get clinical recommendation
   */
  private getRecommendation(riskLevel: string, probability: number): string {
    if (riskLevel === 'high') {
      if (probability >= 0.75) {
        return "🚨 URGENT: Comprehensive discharge planning, intensive case management, transitional care team, 24h post-discharge contact, consider delaying discharge";
      } else {
        return "⚠️ HIGH RISK: Comprehensive discharge planning, case management, transitional care, 24-48h post-discharge contact";
      }
    } else if (riskLevel === 'medium') {
      return "📋 MODERATE RISK: Enhanced discharge planning, medication reconciliation, patient education, 3-7 day follow-up";
    } else {
      return "✅ LOW RISK: Standard discharge planning, routine follow-up in 1-2 weeks, patient education materials";
    }
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: string): number {
    if (!dob) return 50; // Default age if not provided
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Main prediction method
   */
  async predictReadmissionRisk(patient: any, predictionData: CreatePredictionDto): Promise<PredictionResultDto> {
    try {
      this.logger.log(`Starting ML prediction for patient: ${patient.id}`);

      // Calculate clinical risk score
      const { score: clinicalScore, riskFactors } = this.calculateClinicalScore(patient, predictionData);

      // Get ML prediction
      const mlProbability = this.simulateMLPrediction(patient, predictionData);

      // Get age group and multiplier
      const age = patient.age || this.calculateAge(patient.dob);
      const ageGroup = this.standardizeAgeGroup(age);
      const ageMultiplier = this.ageRiskMultipliers[ageGroup] || 1.0;

      // Combined prediction (60% ML, 40% clinical, with age multiplier)
      const baseProbability = (0.60 * mlProbability) + (0.40 * clinicalScore);
      let finalProbability = Math.min(baseProbability * ageMultiplier, 1.0);

      // Critical condition overrides
      if (this.hasCriticalConditions(predictionData)) {
        finalProbability = Math.max(finalProbability, 0.70);
        riskFactors.push('Critical medical conditions detected');
      }

      // ICU admission override
      if (predictionData.intensive_care_unit_admission === 1) {
        finalProbability = Math.max(finalProbability, 0.65);
        riskFactors.push('ICU admission - high risk');
      }

      const riskLevel = this.getRiskLevel(finalProbability);
      const recommendation = this.getRecommendation(riskLevel, finalProbability);

      // Calculate confidence (simplified)
      const confidence = Math.min(75 + (clinicalScore * 15), 95);

      // Store prediction in database
      const predictionResult = await this.storePrediction({
        patient_id: patient.id,
        doctor_id: predictionData.doctor_id,
        risk_level: riskLevel,
        risk_percentage: finalProbability * 100,
        ml_probability: mlProbability * 100,
        clinical_score: clinicalScore * 100,
        age_multiplier: ageMultiplier,
        risk_factors: riskFactors,
        recommendation,
        confidence,
        age_group: ageGroup,
        predicted_at: new Date().toISOString(),
        input_data: predictionData
      });

      this.logger.log(`ML prediction completed for patient: ${patient.id}, risk level: ${riskLevel}`);

      return predictionResult;

    } catch (error) {
      this.logger.error(`Error in ML prediction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Store prediction result in database
   */
  private async storePrediction(predictionData: any): Promise<PredictionResultDto> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data: savedPrediction, error } = await supabase
        .from('ml_predictions')
        .insert(predictionData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error storing prediction: ${error.message}`);
        throw new Error(`Failed to store prediction: ${error.message}`);
      }

      return savedPrediction;
    } catch (error) {
      this.logger.error(`Error storing prediction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get patient predictions history
   */
  async getPatientPredictions(patientId: string): Promise<PredictionResultDto[]> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data: predictions, error } = await supabase
        .from('ml_predictions')
        .select('*')
        .eq('patient_id', patientId)
        .order('predicted_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching predictions: ${error.message}`);
        throw new Error(`Failed to fetch predictions: ${error.message}`);
      }

      return predictions || [];
    } catch (error) {
      this.logger.error(`Error fetching predictions: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all predictions for a department
   */
  async getDepartmentPredictions(department?: string): Promise<any[]> {
    try {
      const supabase = this.supabaseService.getClient();

      let query = supabase
        .from('ml_predictions')
        .select(`
          *,
          patients!inner(
            first_name,
            last_name,
            mrn,
            department
          )
        `)
        .order('predicted_at', { ascending: false });

      if (department) {
        query = query.eq('patients.department', department);
      }

      const { data: predictions, error } = await query;

      if (error) {
        this.logger.error(`Error fetching department predictions: ${error.message}`);
        throw new Error(`Failed to fetch predictions: ${error.message}`);
      }

      return predictions || [];
    } catch (error) {
      this.logger.error(`Error fetching department predictions: ${error.message}`);
      throw error;
    }
  }
}
