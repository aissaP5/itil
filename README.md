# AI Monitoring and Event Management Dashboard

A beginner-friendly full-stack monitoring system that simulates IT infrastructure monitoring with AI-based log analysis and anomaly detection.

## Project Structure

- `backend/`: FastAPI server for AI predictions.
- `frontend/`: React dashboard with TailwindCSS and Chart.js.
- `ml-model/`: Python scripts for training Scikit-learn models.

## Setup Instructions

### 1. Prerequisites
- Python 3.8+
- Node.js & npm

### 2. Backend Setup
```bash
cd ai-monitoring-system/backend
pip install pandas scikit-learn joblib fastapi uvicorn pydantic numpy
```

### 3. ML Model Training
You must train the models before starting the backend:
```bash
cd ai-monitoring-system/ml-model
python train_log_classifier.py
python train_anomaly_detector.py
```
This will create `.pkl` files in the `ml-model/models/` directory.

### 4. Running the Backend
```bash
cd ai-monitoring-system/backend
python main.py
```
The API will be available at `http://localhost:8000`.

### 5. Frontend Setup
```bash
cd ai-monitoring-system/frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

## Features
- **Devices Panel**: Real-time status of monitoring targets.
- **Simulate Incident**: Generate logs and get AI-powered problem classification and recommendations.
- **Anomaly Detection**: Simulated metrics charts with backend anomaly check potential.
- **Event History**: Persistent view of detected security or system events.
- **Dark Mode UI**: Professional monitoring interface inspired by modern DevOps tools.
