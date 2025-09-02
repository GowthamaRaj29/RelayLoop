-- ML Predictions Table
-- This table stores the results of ML readmission risk predictions

CREATE TABLE IF NOT EXISTS ml_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(255) NOT NULL,
    
    -- Input features for ML model
    diabetes INTEGER NOT NULL DEFAULT 0,
    hypertension INTEGER NOT NULL DEFAULT 0,
    heart_disease INTEGER NOT NULL DEFAULT 0,
    kidney_disease INTEGER NOT NULL DEFAULT 0,
    respiratory_disease INTEGER NOT NULL DEFAULT 0,
    
    regular_ward_admission INTEGER NOT NULL DEFAULT 0,
    semi_intensive_unit_admission INTEGER NOT NULL DEFAULT 0,
    intensive_care_unit_admission INTEGER NOT NULL DEFAULT 0,
    
    hemoglobin DECIMAL(4,1) NOT NULL DEFAULT 13.5,
    hematocrit DECIMAL(4,1) NOT NULL DEFAULT 40.0,
    platelets INTEGER NOT NULL DEFAULT 250,
    red_blood_cells DECIMAL(3,1) NOT NULL DEFAULT 4.8,
    lymphocytes DECIMAL(3,1) NOT NULL DEFAULT 2.2,
    urea DECIMAL(4,1) NOT NULL DEFAULT 5.2,
    potassium DECIMAL(3,1) NOT NULL DEFAULT 4.1,
    sodium INTEGER NOT NULL DEFAULT 140,
    
    sars_cov2_exam_result INTEGER NOT NULL DEFAULT 0,
    length_of_stay INTEGER NOT NULL DEFAULT 5,
    num_medications INTEGER NOT NULL DEFAULT 5,
    previous_admissions INTEGER NOT NULL DEFAULT 0,
    
    -- ML Output results
    ml_probability DECIMAL(5,2) NOT NULL,
    clinical_score DECIMAL(5,2) NOT NULL,
    risk_percentage DECIMAL(5,2) NOT NULL,
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    confidence DECIMAL(5,2) NOT NULL,
    age_group VARCHAR(20) NOT NULL,
    age_multiplier DECIMAL(3,2) NOT NULL,
    recommendation TEXT NOT NULL,
    risk_factors TEXT[], -- Array of risk factors identified
    
    -- Metadata
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ml_predictions_patient_id ON ml_predictions(patient_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_predicted_at ON ml_predictions(predicted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_risk_level ON ml_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_doctor_id ON ml_predictions(doctor_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ml_predictions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ml_predictions_updated_at
    BEFORE UPDATE ON ml_predictions
    FOR EACH ROW
    EXECUTE PROCEDURE update_ml_predictions_updated_at();

-- Add comment to table
COMMENT ON TABLE ml_predictions IS 'Stores ML readmission risk prediction results and input features';
COMMENT ON COLUMN ml_predictions.risk_factors IS 'Array of identified risk factors for the patient';
COMMENT ON COLUMN ml_predictions.confidence IS 'Model confidence percentage (0-100)';
COMMENT ON COLUMN ml_predictions.recommendation IS 'Clinical recommendation based on risk assessment';
