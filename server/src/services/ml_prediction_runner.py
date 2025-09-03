#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ML Prediction Runner for RelayLoop
This script is called from Node.js to run ML predictions
"""

import sys
import json
import os
import traceback

# Add the services directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__)))

try:
    # Import our ML service
    from ml_prediction_service import ml_service
    
    def main():
        if len(sys.argv) != 2:
            print("Usage: python ml_prediction_runner.py '<patient_data_json>'", file=sys.stderr)
            sys.exit(1)
        
        try:
            # Parse input data
            patient_data = json.loads(sys.argv[1])
            
            # Initialize ML service if not already done
            if not ml_service.is_initialized:
                data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
                ml_service.initialize(data_path)
            
            # Make prediction
            prediction_result = ml_service.predict_readmission(patient_data)
            
            # Output result as JSON
            print(json.dumps(prediction_result))
            
        except Exception as e:
            error_result = {
                'error': str(e),
                'traceback': traceback.format_exc(),
                'risk_level': 'error'
            }
            print(json.dumps(error_result))
            sys.exit(1)
    
    if __name__ == "__main__":
        main()
        
except ImportError as e:
    # If we can't import the ML service, provide a simple mock response
    error_result = {
        'error': f'ML service not available: {str(e)}',
        'risk_level': 'medium',
        'risk_percentage': 35.0,
        'ml_probability': 30.0,
        'clinical_score': 40.0,
        'age_multiplier': 1.2,
        'risk_factors': ['ML service unavailable - using fallback prediction'],
        'recommendation': 'MODERATE RISK: Enhanced discharge planning, medication reconciliation, patient education, 3-7 day follow-up',
        'confidence': 60.0,
        'age_group': 'Unknown'
    }
    print(json.dumps(error_result))
