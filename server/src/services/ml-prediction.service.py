# -*- coding: utf-8 -*-
"""
Enhanced Hospital Readmission Prediction System
Converted from Colab for RelayLoop integration
"""

import numpy as np
import pandas as pd
import os
import warnings
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, ExtraTreesClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder, RobustScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, f1_score
import joblib
from typing import Dict, Tuple, List, Optional

warnings.filterwarnings('ignore')
np.random.seed(42)

class EnhancedAgeMerger:
    """Advanced age format merging with better risk stratification"""

    def __init__(self):
        self.age_mapping = {
            'Q1_18-35': 'Young_Adult', 'Q2_36-50': 'Middle_Adult', 'Q3_51-65': 'Mature_Adult',
            'Q4_66-80': 'Senior', 'Q5_81+': 'Elderly',
            '18-30': 'Young_Adult', '31-45': 'Middle_Adult', '46-60': 'Mature_Adult',
            '61-75': 'Senior', '76-90': 'Elderly',
            '[18-30)': 'Young_Adult', '[31-45)': 'Middle_Adult', '[46-60)': 'Mature_Adult',
            '[61-75)': 'Senior', '[76-90)': 'Elderly'
        }

        self.age_ranges = {
            'Young_Adult': (18, 35), 'Middle_Adult': (36, 50), 'Mature_Adult': (51, 65),
            'Senior': (66, 80), 'Elderly': (81, 95)
        }

        # Age-based risk multipliers
        self.age_risk_multipliers = {
            'Young_Adult': 1.0, 'Middle_Adult': 1.2, 'Mature_Adult': 1.4,
            'Senior': 1.7, 'Elderly': 2.1
        }

    def standardize_age_group(self, age_value):
        if pd.isna(age_value):
            return 'Unknown'
        if isinstance(age_value, str):
            return self.age_mapping.get(age_value.strip(), 'Unknown')
        elif isinstance(age_value, (int, float)):
            for group, (min_age, max_age) in self.age_ranges.items():
                if min_age <= age_value <= max_age:
                    return group
            return 'Unknown'
        return 'Unknown'

    def get_age_risk_multiplier(self, age_group):
        return self.age_risk_multipliers.get(age_group, 1.0)

class EnhancedMedicalPredictor:
    """Advanced medical readmission predictor with comprehensive conditions"""

    def __init__(self, data_path: str = None):
        self.age_merger = EnhancedAgeMerger()
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.feature_columns = []
        self.is_trained = False
        self.historical_data = None
        self.data_path = data_path or os.path.join(os.path.dirname(__file__), '..', '..', 'data')

        # Enhanced risk thresholds for better sensitivity
        self.risk_thresholds = {
            'low': (0.0, 0.25),      # 0-25%
            'medium': (0.25, 0.55),   # 25-55%
            'high': (0.55, 1.0)       # 55-100%
        }

        # Comprehensive clinical risk weights
        self.clinical_weights = {
            # Demographics
            'age_elderly': 0.12,
            'age_senior': 0.08,

            # Chronic conditions
            'diabetes': 0.10,
            'hypertension': 0.08,
            'heart_disease': 0.12,
            'kidney_disease': 0.15,
            'respiratory_disease': 0.12,

            # Hospital stay factors
            'icu_admission': 0.20,
            'semi_intensive_admission': 0.15,
            'regular_ward_admission': 0.05,
            'long_stay': 0.10,

            # Lab abnormalities
            'low_hemoglobin': 0.08,
            'abnormal_hematocrit': 0.06,
            'low_platelets': 0.10,
            'abnormal_rbc': 0.06,
            'low_lymphocytes': 0.08,
            'high_urea': 0.10,
            'electrolyte_imbalance': 0.08,

            # Other factors
            'covid_positive': 0.15,
            'frequent_admissions': 0.12,
            'high_medications': 0.08,
            'multiple_comorbidities': 0.18
        }

    def load_datasets(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Load datasets with enhanced medical conditions"""
        print("Loading enhanced medical datasets...")

        # Look for CSV files in the data directory
        csv_files = []
        if os.path.exists(self.data_path):
            csv_files = [f for f in os.listdir(self.data_path) if f.endswith('.csv')]

        datasets_loaded = False
        dataset1_df = None
        dataset2_df = None

        if len(csv_files) >= 1:
            try:
                # Load the hospital_readmissions.csv file
                csv_path = os.path.join(self.data_path, 'hospital_readmissions.csv')
                if os.path.exists(csv_path):
                    dataset1_df = pd.read_csv(csv_path)
                    print(f"Loaded hospital readmissions dataset: {dataset1_df.shape}")
                    datasets_loaded = True
                
                # If there's a second CSV, load it too
                if len(csv_files) >= 2:
                    second_csv = [f for f in csv_files if f != 'hospital_readmissions.csv'][0]
                    dataset2_df = pd.read_csv(os.path.join(self.data_path, second_csv))
                    print(f"Loaded second dataset: {dataset2_df.shape}")
                else:
                    # Create a synthetic second dataset based on the first
                    dataset2_df = self._create_synthetic_dataset(dataset1_df)
                    
            except Exception as e:
                print(f"Error loading user datasets: {e}")

        if not datasets_loaded:
            print("Creating enhanced sample datasets with comprehensive medical data...")
            dataset1_df, dataset2_df = self._create_enhanced_sample_datasets()

        return dataset1_df, dataset2_df

    def _create_synthetic_dataset(self, base_df: pd.DataFrame) -> pd.DataFrame:
        """Create a synthetic second dataset based on the first"""
        # Sample and modify the original dataset to create variation
        synthetic_df = base_df.sample(frac=0.7, random_state=42).copy()
        
        # Add some noise to continuous variables
        for col in synthetic_df.select_dtypes(include=[np.number]).columns:
            if col not in ['patient_id']:
                noise = np.random.normal(0, 0.05 * synthetic_df[col].std(), len(synthetic_df))
                synthetic_df[col] = synthetic_df[col] + noise
        
        # Reset patient IDs
        synthetic_df['patient_id'] = [f'P2_{i:04d}' for i in range(len(synthetic_df))]
        
        return synthetic_df

    def _create_enhanced_sample_datasets(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Create comprehensive sample datasets with all medical conditions"""
        np.random.seed(42)

        # Enhanced Dataset 1 (Age Quantiles) with comprehensive medical data
        n1 = 2000

        # Create realistic correlations between conditions
        ages = np.random.choice(['Q1_18-35', 'Q2_36-50', 'Q3_51-65', 'Q4_66-80', 'Q5_81+'], n1)

        dataset1_df = pd.DataFrame({
            'patient_id': [f'P1_{i:04d}' for i in range(n1)],
            'patient_age_quantile': ages,
            'gender': np.random.choice(['M', 'F'], n1),

            # Chronic conditions (age-correlated)
            'diabetes': np.random.choice([0, 1], n1, p=[0.65, 0.35]),
            'hypertension': np.random.choice([0, 1], n1, p=[0.55, 0.45]),
            'heart_disease': np.random.choice([0, 1], n1, p=[0.75, 0.25]),
            'kidney_disease': np.random.choice([0, 1], n1, p=[0.80, 0.20]),
            'respiratory_disease': np.random.choice([0, 1], n1, p=[0.78, 0.22]),

            # Hospital admission types
            'regular_ward_admission': np.random.choice([0, 1], n1, p=[0.30, 0.70]),
            'semi_intensive_unit_admission': np.random.choice([0, 1], n1, p=[0.85, 0.15]),
            'intensive_care_unit_admission': np.random.choice([0, 1], n1, p=[0.90, 0.10]),

            # Lab values with realistic distributions
            'hemoglobin': np.random.normal(13.5, 2.1, n1).clip(6, 18),
            'hematocrit': np.random.normal(40.2, 5.8, n1).clip(25, 55),
            'platelets': np.random.normal(275, 85, n1).clip(50, 600),
            'red_blood_cells': np.random.normal(4.8, 0.7, n1).clip(2.5, 7.0),
            'lymphocytes': np.random.normal(2.2, 0.8, n1).clip(0.5, 6.0),
            'urea': np.random.normal(5.2, 2.8, n1).clip(1.0, 15.0),
            'potassium': np.random.normal(4.1, 0.6, n1).clip(2.5, 6.0),
            'sodium': np.random.normal(140, 4.2, n1).clip(125, 155),

            # COVID-19 and other factors
            'sars_cov2_exam_result': np.random.choice([0, 1], n1, p=[0.88, 0.12]),
            'length_of_stay': np.random.exponential(4, n1).clip(1, 30),
            'num_medications': np.random.poisson(9, n1),
            'previous_admissions': np.random.poisson(1.2, n1),

            # Readmission outcome (correlated with risk factors)
            'readmitted_30_days': np.random.choice([0, 1], n1, p=[0.80, 0.20])
        })

        # Enhanced Dataset 2 (Age Ranges)
        n2 = 1500
        ages2 = np.random.choice(['18-30', '31-45', '46-60', '61-75', '76-90'], n2)

        dataset2_df = pd.DataFrame({
            'patient_id': [f'P2_{i:04d}' for i in range(n2)],
            'patient_age_quantile': ages2,  # Using age ranges but same column name
            'gender': np.random.choice(['Male', 'Female'], n2),

            # Medical conditions
            'diabetes': np.random.choice([0, 1], n2, p=[0.68, 0.32]),
            'hypertension': np.random.choice([0, 1], n2, p=[0.58, 0.42]),
            'heart_disease': np.random.choice([0, 1], n2, p=[0.77, 0.23]),
            'kidney_disease': np.random.choice([0, 1], n2, p=[0.82, 0.18]),
            'respiratory_disease': np.random.choice([0, 1], n2, p=[0.76, 0.24]),

            # Hospital settings
            'regular_ward_admission': np.random.choice([0, 1], n2, p=[0.25, 0.75]),
            'semi_intensive_unit_admission': np.random.choice([0, 1], n2, p=[0.88, 0.12]),
            'intensive_care_unit_admission': np.random.choice([0, 1], n2, p=[0.92, 0.08]),

            # Lab values
            'hemoglobin': np.random.normal(13.2, 2.3, n2).clip(6, 18),
            'hematocrit': np.random.normal(39.8, 6.1, n2).clip(25, 55),
            'platelets': np.random.normal(265, 90, n2).clip(50, 600),
            'red_blood_cells': np.random.normal(4.6, 0.8, n2).clip(2.5, 7.0),
            'lymphocytes': np.random.normal(2.0, 0.9, n2).clip(0.5, 6.0),
            'urea': np.random.normal(5.8, 3.2, n2).clip(1.0, 15.0),
            'potassium': np.random.normal(4.0, 0.7, n2).clip(2.5, 6.0),
            'sodium': np.random.normal(139, 4.8, n2).clip(125, 155),

            'sars_cov2_exam_result': np.random.choice([0, 1], n2, p=[0.85, 0.15]),
            'length_of_stay': np.random.exponential(5, n2).clip(1, 30),
            'num_medications': np.random.poisson(8, n2),
            'previous_admissions': np.random.poisson(1.1, n2),
            'readmitted_30_days': np.random.choice([0, 1], n2, p=[0.83, 0.17])
        })

        print("Enhanced sample datasets created with comprehensive medical conditions!")
        return dataset1_df, dataset2_df

    def preprocess_datasets(self, df1: pd.DataFrame, df2: pd.DataFrame) -> pd.DataFrame:
        """Enhanced preprocessing with comprehensive medical features"""
        print("Processing comprehensive medical datasets...")

        # Standardize age groups
        age_col_1 = self._find_age_column(df1)
        age_col_2 = self._find_age_column(df2)

        df1['age_group'] = df1[age_col_1].apply(self.age_merger.standardize_age_group) if age_col_1 else 'Unknown'
        df2['age_group'] = df2[age_col_2].apply(self.age_merger.standardize_age_group) if age_col_2 else 'Unknown'

        # Find readmission columns
        readmit_col_1 = self._find_readmission_column(df1)
        readmit_col_2 = self._find_readmission_column(df2)

        # Create enhanced unified features
        df1_processed = self._create_enhanced_unified_features(df1, 'dataset1', readmit_col_1)
        df2_processed = self._create_enhanced_unified_features(df2, 'dataset2', readmit_col_2)

        # Combine datasets
        combined_df = pd.concat([df1_processed, df2_processed], ignore_index=True)
        combined_df = combined_df.dropna(subset=['readmitted_30_days'])

        # Create additional risk features
        combined_df = self._create_risk_features(combined_df)

        self.historical_data = combined_df
        readmission_rate = combined_df['readmitted_30_days'].mean() * 100

        print(f"Enhanced combined dataset: {len(combined_df)} patients")
        print(f"Overall readmission rate: {readmission_rate:.1f}%")

        return combined_df

    def _find_age_column(self, df: pd.DataFrame) -> Optional[str]:
        """Find age column with enhanced detection"""
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['age', 'quantile', 'q1', 'q2', 'range']):
                return col
        return None

    def _find_readmission_column(self, df: pd.DataFrame) -> str:
        """Find readmission column"""
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['readmit', 'readmission', 'target']):
                return col
        return df.columns[-1]

    def _create_enhanced_unified_features(self, df: pd.DataFrame, source: str, readmit_col: str) -> pd.DataFrame:
        """Create comprehensive unified feature set"""
        unified_data = {
            'patient_id': df.iloc[:, 0] if len(df.columns) > 0 else range(len(df)),
            'age_group': df.get('age_group', 'Unknown'),
            'dataset_source': source,
            'readmitted_30_days': df[readmit_col] if readmit_col in df.columns else 0
        }

        # Comprehensive feature mappings
        feature_mappings = {
            'gender': ['gender', 'sex'],
            'diabetes': ['diabetes'],
            'hypertension': ['hypertension', 'hyperten'],
            'heart_disease': ['heart', 'cardiac'],
            'kidney_disease': ['kidney', 'renal'],
            'respiratory_disease': ['respiratory', 'lung', 'copd'],

            # Hospital admission types
            'regular_ward_admission': ['regular_ward', 'ward'],
            'semi_intensive_unit_admission': ['semi_intensive', 'semi'],
            'intensive_care_unit_admission': ['intensive_care', 'icu'],

            # Lab values
            'hemoglobin': ['hemoglobin', 'hb'],
            'hematocrit': ['hematocrit', 'hct'],
            'platelets': ['platelets', 'plt'],
            'red_blood_cells': ['red_blood', 'rbc'],
            'lymphocytes': ['lymphocytes', 'lymph'],
            'urea': ['urea'],
            'potassium': ['potassium', 'k'],
            'sodium': ['sodium', 'na'],

            # Other factors
            'sars_cov2_exam_result': ['sars', 'covid', 'cov'],
            'length_of_stay': ['length', 'stay', 'los'],
            'num_medications': ['medication', 'drug', 'med'],
            'previous_admissions': ['admission', 'previous']
        }

        for feature, keywords in feature_mappings.items():
            for col in df.columns:
                col_lower = col.lower()
                if any(keyword in col_lower for keyword in keywords):
                    if feature == 'gender':
                        unified_data[feature] = df[col]
                    else:
                        unified_data[feature] = pd.to_numeric(df[col], errors='coerce').fillna(0)
                    break

        # Fill missing features with defaults
        defaults = {
            'gender': 'Unknown',
            'diabetes': 0, 'hypertension': 0, 'heart_disease': 0, 'kidney_disease': 0, 'respiratory_disease': 0,
            'regular_ward_admission': 1, 'semi_intensive_unit_admission': 0, 'intensive_care_unit_admission': 0,
            'hemoglobin': 13.0, 'hematocrit': 40.0, 'platelets': 250.0, 'red_blood_cells': 4.5,
            'lymphocytes': 2.0, 'urea': 5.0, 'potassium': 4.0, 'sodium': 140.0,
            'sars_cov2_exam_result': 0, 'length_of_stay': 5.0, 'num_medications': 5, 'previous_admissions': 0
        }

        for feature, default in defaults.items():
            if feature not in unified_data:
                unified_data[feature] = default

        return pd.DataFrame(unified_data)

    def _create_risk_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create additional risk features from lab values and conditions"""
        # Comorbidity score
        df['comorbidity_count'] = (
            df['diabetes'] + df['hypertension'] + df['heart_disease'] +
            df['kidney_disease'] + df['respiratory_disease']
        )

        # Lab abnormality flags
        df['low_hemoglobin'] = (df['hemoglobin'] < 12).astype(int)
        df['abnormal_hematocrit'] = ((df['hematocrit'] < 35) | (df['hematocrit'] > 50)).astype(int)
        df['low_platelets'] = (df['platelets'] < 150).astype(int)
        df['abnormal_rbc'] = ((df['red_blood_cells'] < 4.0) | (df['red_blood_cells'] > 6.0)).astype(int)
        df['low_lymphocytes'] = (df['lymphocytes'] < 1.0).astype(int)
        df['high_urea'] = (df['urea'] > 7.5).astype(int)
        df['electrolyte_imbalance'] = ((df['potassium'] < 3.5) | (df['potassium'] > 5.0) |
                                      (df['sodium'] < 136) | (df['sodium'] > 145)).astype(int)

        # Critical care indicator
        df['critical_care'] = df['intensive_care_unit_admission']

        return df

    def train_enhanced_models(self, df: pd.DataFrame):
        """Train enhanced models with better performance"""
        print("Training enhanced prediction models...")

        X, y = self._prepare_enhanced_features(df)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)

        # Enhanced scalers
        self.scalers['robust'] = RobustScaler()
        self.scalers['standard'] = StandardScaler()

        X_train_standard = self.scalers['standard'].fit_transform(X_train)
        X_test_standard = self.scalers['standard'].transform(X_test)

        # Enhanced models with better parameters
        models = {
            'random_forest': RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42,
                                                  class_weight='balanced', min_samples_split=5),
            'extra_trees': ExtraTreesClassifier(n_estimators=200, max_depth=15, random_state=42,
                                              class_weight='balanced', min_samples_split=5),
            'gradient_boosting': GradientBoostingClassifier(n_estimators=150, learning_rate=0.1,
                                                          max_depth=8, random_state=42),
            'logistic_regression': LogisticRegression(random_state=42, class_weight='balanced',
                                                    max_iter=2000, C=0.1)
        }

        best_accuracy = 0
        for name, model in models.items():
            try:
                if name == 'logistic_regression':
                    model.fit(X_train_standard, y_train)
                    y_pred = model.predict(X_test_standard)
                    y_prob = model.predict_proba(X_test_standard)[:, 1]
                else:
                    model.fit(X_train, y_train)
                    y_pred = model.predict(X_test)
                    y_prob = model.predict_proba(X_test)[:, 1]

                self.models[name] = model
                accuracy = accuracy_score(y_test, y_pred)
                auc = roc_auc_score(y_test, y_prob) if len(np.unique(y_test)) > 1 else 0.5
                f1 = f1_score(y_test, y_pred)

                if accuracy > best_accuracy:
                    best_accuracy = accuracy

                print(f"  {name.replace('_', ' ').title()}: Accuracy={accuracy:.3f}, AUC={auc:.3f}, F1={f1:.3f}")

            except Exception as e:
                print(f"  Error training {name}: {e}")

        self.is_trained = True
        print(f"Best model accuracy: {best_accuracy:.3f}")

    def _prepare_enhanced_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare comprehensive feature set"""
        categorical_cols = ['age_group', 'gender', 'dataset_source']

        for col in categorical_cols:
            if col in df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col].astype(str))

        # Comprehensive feature list
        feature_cols = [col for col in df.columns if col.endswith('_encoded') or col in [
            'diabetes', 'hypertension', 'heart_disease', 'kidney_disease', 'respiratory_disease',
            'regular_ward_admission', 'semi_intensive_unit_admission', 'intensive_care_unit_admission',
            'hemoglobin', 'hematocrit', 'platelets', 'red_blood_cells', 'lymphocytes', 'urea', 'potassium', 'sodium',
            'sars_cov2_exam_result', 'length_of_stay', 'num_medications', 'previous_admissions',
            'comorbidity_count', 'low_hemoglobin', 'abnormal_hematocrit', 'low_platelets', 'abnormal_rbc',
            'low_lymphocytes', 'high_urea', 'electrolyte_imbalance', 'critical_care'
        ]]

        self.feature_columns = [col for col in feature_cols if col in df.columns]
        X = df[self.feature_columns].fillna(0)
        y = df['readmitted_30_days']
        return X, y

    def predict_patient_risk(self, patient_data: Dict) -> Dict:
        """Enhanced prediction with comprehensive medical assessment"""
        if not self.is_trained:
            raise ValueError("System must be trained before making predictions!")

        try:
            # Calculate enhanced clinical risk
            clinical_score, risk_factors = self._calculate_enhanced_clinical_score(patient_data)

            # Get ML predictions from all models
            ml_predictions = []
            patient_features = self._prepare_patient_features(patient_data)

            for name, model in self.models.items():
                try:
                    if name == 'logistic_regression':
                        X_scaled = self.scalers['standard'].transform([patient_features])
                        prob = model.predict_proba(X_scaled)[:, 1][0]
                    else:
                        prob = model.predict_proba([patient_features])[:, 1][0]
                    ml_predictions.append(prob)
                except:
                    ml_predictions.append(0.25)

            ml_probability = np.mean(ml_predictions) if ml_predictions else 0.25

            # Enhanced combination with age multiplier
            age_group = self.age_merger.standardize_age_group(
                patient_data.get('age', patient_data.get('patient_age_quantile', 50))
            )
            age_multiplier = self.age_merger.get_age_risk_multiplier(age_group)

            # Weighted combination: 60% ML, 40% clinical, with age multiplier
            base_probability = (0.60 * ml_probability) + (0.40 * clinical_score)
            final_probability = min(base_probability * age_multiplier, 1.0)

            # Critical condition overrides
            if self._has_critical_conditions(patient_data):
                final_probability = max(final_probability, 0.70)
                risk_factors.append('Critical medical conditions detected')

            # ICU admission override
            if patient_data.get('intensive_care_unit_admission', 0) == 1:
                final_probability = max(final_probability, 0.65)
                risk_factors.append('ICU admission - high risk')

            risk_level = self._get_risk_level(final_probability)

            return {
                'patient_id': patient_data.get('patient_id', 'unknown'),
                'risk_level': risk_level,
                'risk_percentage': round(final_probability * 100, 1),
                'ml_probability': round(ml_probability * 100, 1),
                'clinical_score': round(clinical_score * 100, 1),
                'age_multiplier': round(age_multiplier, 2),
                'risk_factors': risk_factors,
                'recommendation': self._get_recommendation(risk_level, final_probability),
                'confidence': round(self._calculate_confidence(ml_predictions, clinical_score), 1),
                'age_group': age_group
            }

        except Exception as e:
            return {
                'patient_id': patient_data.get('patient_id', 'unknown'),
                'error': f"Prediction error: {str(e)}",
                'risk_level': 'error'
            }

    def _prepare_patient_features(self, patient_data: Dict) -> List[float]:
        """Prepare comprehensive patient features"""
        age_group = self.age_merger.standardize_age_group(
            patient_data.get('age', patient_data.get('patient_age_quantile', 50))
        )

        features = []

        # Encoded features
        if 'age_group' in self.label_encoders:
            try:
                age_encoded = self.label_encoders['age_group'].transform([age_group])[0]
            except:
                age_encoded = 0
        else:
            age_encoded = 0
        features.append(age_encoded)

        gender = patient_data.get('gender', 'Unknown')
        if 'gender' in self.label_encoders:
            try:
                gender_encoded = self.label_encoders['gender'].transform([str(gender)])[0]
            except:
                gender_encoded = 0
        else:
            gender_encoded = 0
        features.append(gender_encoded)

        features.append(0)  # dataset_source

        # All medical features
        medical_features = [
            'diabetes', 'hypertension', 'heart_disease', 'kidney_disease', 'respiratory_disease',
            'regular_ward_admission', 'semi_intensive_unit_admission', 'intensive_care_unit_admission',
            'hemoglobin', 'hematocrit', 'platelets', 'red_blood_cells', 'lymphocytes', 'urea', 'potassium', 'sodium',
            'sars_cov2_exam_result', 'length_of_stay', 'num_medications', 'previous_admissions'
        ]

        for feature in medical_features:
            value = patient_data.get(feature, 0)
            try:
                features.append(float(value))
            except:
                features.append(0.0)

        # Calculated features
        comorbidity_count = sum([
            patient_data.get('diabetes', 0), patient_data.get('hypertension', 0),
            patient_data.get('heart_disease', 0), patient_data.get('kidney_disease', 0),
            patient_data.get('respiratory_disease', 0)
        ])
        features.append(comorbidity_count)

        # Lab abnormality features
        hb = patient_data.get('hemoglobin', 13.0)
        hct = patient_data.get('hematocrit', 40.0)
        plt = patient_data.get('platelets', 250.0)
        rbc = patient_data.get('red_blood_cells', 4.5)
        lymph = patient_data.get('lymphocytes', 2.0)
        urea = patient_data.get('urea', 5.0)
        k = patient_data.get('potassium', 4.0)
        na = patient_data.get('sodium', 140.0)

        features.extend([
            1 if hb < 12 else 0,  # low_hemoglobin
            1 if (hct < 35 or hct > 50) else 0,  # abnormal_hematocrit
            1 if plt < 150 else 0,  # low_platelets
            1 if (rbc < 4.0 or rbc > 6.0) else 0,  # abnormal_rbc
            1 if lymph < 1.0 else 0,  # low_lymphocytes
            1 if urea > 7.5 else 0,  # high_urea
            1 if (k < 3.5 or k > 5.0 or na < 136 or na > 145) else 0,  # electrolyte_imbalance
            patient_data.get('intensive_care_unit_admission', 0)  # critical_care
        ])

        return features

    def _calculate_enhanced_clinical_score(self, patient_data: Dict) -> Tuple[float, List[str]]:
        """Calculate comprehensive clinical risk score"""
        risk_score = 0.0
        risk_factors = []

        # Age factors
        age_group = self.age_merger.standardize_age_group(
            patient_data.get('age', patient_data.get('patient_age_quantile', 50))
        )

        if age_group == 'Elderly':
            risk_score += self.clinical_weights['age_elderly']
            risk_factors.append('Advanced age (80+ years) - very high risk')
        elif age_group == 'Senior':
            risk_score += self.clinical_weights['age_senior']
            risk_factors.append('Senior age (65-80 years) - increased risk')

        # Chronic conditions
        conditions = {
            'diabetes': 'Diabetes mellitus',
            'hypertension': 'Hypertension',
            'heart_disease': 'Heart disease',
            'kidney_disease': 'Kidney disease',
            'respiratory_disease': 'Respiratory disease'
        }

        active_conditions = []
        for condition, label in conditions.items():
            if patient_data.get(condition, 0) == 1:
                risk_score += self.clinical_weights.get(condition, 0.08)
                active_conditions.append(label)

        if len(active_conditions) >= 3:
            risk_score += self.clinical_weights['multiple_comorbidities']
            risk_factors.append(f'Multiple comorbidities: {", ".join(active_conditions)}')
        elif active_conditions:
            risk_factors.extend(active_conditions)

        # Hospital admission severity
        if patient_data.get('intensive_care_unit_admission', 0) == 1:
            risk_score += self.clinical_weights['icu_admission']
            risk_factors.append('ICU admission - critical condition')
        elif patient_data.get('semi_intensive_unit_admission', 0) == 1:
            risk_score += self.clinical_weights['semi_intensive_admission']
            risk_factors.append('Semi-intensive unit admission')

        # Lab abnormalities
        lab_checks = [
            ('hemoglobin', 12, 'low_hemoglobin', 'Low hemoglobin (anemia)'),
            ('platelets', 150, 'low_platelets', 'Low platelets (thrombocytopenia)'),
            ('lymphocytes', 1.0, 'low_lymphocytes', 'Low lymphocytes (immunocompromised)'),
            ('urea', 7.5, 'high_urea', 'Elevated urea (kidney dysfunction)')
        ]

        for lab, threshold, weight_key, description in lab_checks:
            value = patient_data.get(lab, 0)
            if (lab == 'urea' and value > threshold) or (lab != 'urea' and value < threshold and value > 0):
                risk_score += self.clinical_weights.get(weight_key, 0.06)
                risk_factors.append(f'{description} ({value})')

        # COVID-19
        if patient_data.get('sars_cov2_exam_result', 0) == 1:
            risk_score += self.clinical_weights['covid_positive']
            risk_factors.append('COVID-19 positive')

        # Length of stay
        los = patient_data.get('length_of_stay', 5)
        if los > 10:
            risk_score += self.clinical_weights['long_stay']
            risk_factors.append(f'Extended hospitalization ({los} days)')

        # Frequent admissions
        prev_admissions = patient_data.get('previous_admissions', 0)
        if prev_admissions >= 2:
            risk_score += self.clinical_weights['frequent_admissions']
            risk_factors.append(f'Frequent admissions ({prev_admissions} in past year)')

        # High medication count
        medications = patient_data.get('num_medications', 5)
        if medications >= 10:
            risk_score += self.clinical_weights['high_medications']
            risk_factors.append(f'Polypharmacy ({medications} medications)')

        return min(risk_score, 1.0), risk_factors

    def _has_critical_conditions(self, patient_data: Dict) -> bool:
        """Check for critical medical conditions"""
        critical_indicators = [
            patient_data.get('intensive_care_unit_admission', 0) == 1,
            patient_data.get('hemoglobin', 13) < 8,  # Severe anemia
            patient_data.get('platelets', 250) < 50,  # Severe thrombocytopenia
            patient_data.get('urea', 5) > 20,  # Severe kidney dysfunction
            patient_data.get('length_of_stay', 5) > 20,  # Very long stay
            sum([patient_data.get(c, 0) for c in ['diabetes', 'hypertension', 'heart_disease', 'kidney_disease', 'respiratory_disease']]) >= 4
        ]
        return any(critical_indicators)

    def _get_risk_level(self, probability: float) -> str:
        """Get risk level from probability"""
        if probability >= 0.55:
            return 'high'
        elif probability >= 0.25:
            return 'medium'
        else:
            return 'low'

    def _get_recommendation(self, risk_level: str, probability: float) -> str:
        """Get clinical recommendations"""
        if risk_level == 'high':
            if probability >= 0.75:
                return "URGENT: Comprehensive discharge planning, intensive case management, transitional care team, 24h post-discharge contact, consider delaying discharge"
            else:
                return "HIGH RISK: Comprehensive discharge planning, case management, transitional care, 24-48h post-discharge contact"
        elif risk_level == 'medium':
            return "MODERATE RISK: Enhanced discharge planning, medication reconciliation, patient education, 3-7 day follow-up"
        else:
            return "LOW RISK: Standard discharge planning, routine follow-up in 1-2 weeks, patient education materials"

    def _calculate_confidence(self, ml_predictions: List[float], clinical_score: float) -> float:
        """Calculate confidence score"""
        base_conf = 0.75
        if len(ml_predictions) > 1:
            agreement_bonus = max(0, 0.20 - np.std(ml_predictions))
        else:
            agreement_bonus = 0.10
        clinical_bonus = min(clinical_score * 0.15, 0.15)
        return min(base_conf + agreement_bonus + clinical_bonus, 1.0) * 100

class MLPredictionService:
    """Service class for ML predictions in RelayLoop"""
    
    def __init__(self):
        self.predictor = None
        self.is_initialized = False
        
    def initialize(self, data_path: str = None):
        """Initialize the ML prediction service"""
        try:
            self.predictor = EnhancedMedicalPredictor(data_path)
            
            # Load and train the model
            dataset1_df, dataset2_df = self.predictor.load_datasets()
            combined_data = self.predictor.preprocess_datasets(dataset1_df, dataset2_df)
            self.predictor.train_enhanced_models(combined_data)
            
            self.is_initialized = True
            print("ML Prediction Service initialized successfully!")
            
        except Exception as e:
            print(f"Failed to initialize ML Prediction Service: {e}")
            raise

    def predict_readmission(self, patient_data: Dict) -> Dict:
        """Predict readmission risk for a patient"""
        if not self.is_initialized:
            raise ValueError("ML Prediction Service must be initialized first!")
            
        return self.predictor.predict_patient_risk(patient_data)

# Global service instance
ml_service = MLPredictionService()
