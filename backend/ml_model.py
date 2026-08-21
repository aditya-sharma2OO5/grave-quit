import os
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')

class QuitRiskModel:
    def __init__(self):
        self.model = None

    def train_on_synthetic_data(self):
        # Synthetic data features: 
        # [days_active, user_total_quit_count, user_total_completed_count]
        # Target: 1 (will quit soon), 0 (will not quit soon)
        
        # Generating some naive synthetic data that makes sense:
        # High days_active + high quit count = high risk
        # Low days_active + high complete count = low risk
        
        X = np.array([
            [2, 0, 0],   # new item, new user -> low risk
            [15, 4, 0],  # old item, user quits a lot -> high risk
            [5, 1, 3],   # medium item, user completes a lot -> low risk
            [30, 5, 1],  # old item, user quits a lot -> high risk
            [1, 0, 5],   # new item, user completes a lot -> low risk
            [10, 3, 1],  # high risk
            [20, 2, 2],  # medium risk
            [3, 5, 0],   # high risk (user quits immediately)
        ])
        
        y = np.array([0, 1, 0, 1, 0, 1, 0, 1])
        
        self.model = LogisticRegression()
        self.model.fit(X, y)
        
        # Save model
        joblib.dump(self.model, MODEL_PATH)
        print("Model trained and saved to", MODEL_PATH)

    def load_model(self):
        if not os.path.exists(MODEL_PATH):
            self.train_on_synthetic_data()
        self.model = joblib.load(MODEL_PATH)

    def predict_risk(self, days_active: int, user_total_quit: int, user_total_completed: int) -> float:
        if self.model is None:
            self.load_model()
            
        features = np.array([[days_active, user_total_quit, user_total_completed]])
        # Predict probability of class 1 (quit)
        prob = self.model.predict_proba(features)[0][1]
        
        # Return percentage rounded to 1 decimal place
        return round(prob * 100, 1)

# Singleton instance
risk_model = QuitRiskModel()

if __name__ == "__main__":
    risk_model.train_on_synthetic_data()
    # Test
    print("Risk for [days_active=10, quit=4, completed=0]:", risk_model.predict_risk(10, 4, 0), "%")
    print("Risk for [days_active=5, quit=0, completed=3]:", risk_model.predict_risk(5, 0, 3), "%")
