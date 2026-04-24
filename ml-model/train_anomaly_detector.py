import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
import os

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Load dataset
df = pd.read_csv('dataset_metrics.csv')

# Train model
# contamination is the expected proportion of outliers (anomalies)
model = IsolationForest(contamination=0.2, random_state=42)
model.fit(df)

# Save model
joblib.dump(model, 'models/anomaly_model.pkl')

print("Anomaly detection model saved to models/ directory.")
