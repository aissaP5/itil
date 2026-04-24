import pandas as pd
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import os

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Load dataset
df = pd.read_csv('dataset_log.csv')

# Preprocess
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df['log'])
y = df['label']

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save model and vectorizer
joblib.dump(model, 'models/model.pkl')
joblib.dump(vectorizer, 'models/vectorizer.pkl')

print("Log classification model and vectorizer saved to models/ directory.")
