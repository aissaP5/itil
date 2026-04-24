from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import numpy as np
import time
import math
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Monitoring API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
MODEL_PATH = "../ml-model/models/"
try:
    log_model = joblib.load(os.path.join(MODEL_PATH, "model.pkl"))
    vectorizer = joblib.load(os.path.join(MODEL_PATH, "vectorizer.pkl"))
    anomaly_model = joblib.load(os.path.join(MODEL_PATH, "anomaly_model.pkl"))
except Exception as e:
    print(f"Error loading models: {e}")
    log_model = None
    vectorizer = None
    anomaly_model = None

# --- Simulation Engine ---
class SimulationEngine:
    def __init__(self):
        self.scenario = "Normal"
        self.start_time = time.time()
        
    def set_scenario(self, scenario: str):
        self.scenario = scenario
        self.start_time = time.time()

    def get_metrics(self, device_name: str, device_type: str):
        elapsed = time.time() - self.start_time
        
        # Base patterns using sine waves for "daily" variation
        base_cpu = 20 + 5 * math.sin(elapsed * 0.1)
        base_ram = 40 + 2 * math.sin(elapsed * 0.05)
        base_net = 10 + 3 * math.sin(elapsed * 0.2)
        
        # Scenario modifiers
        if self.scenario == "DDoS Attack" and device_type in ["Web", "Network"]:
            base_cpu += 60 + np.random.randint(0, 15)
            base_net += 80 + np.random.randint(0, 10)
        elif self.scenario == "Memory Leak" and device_name == "Server-01":
            # Linear increase over time
            base_ram += min(50, elapsed * 0.5) 
            base_cpu += 10
        elif self.scenario == "Storage Full" and device_type == "Database":
            base_ram += 20
            base_cpu += 15

        # Add Gaussian noise
        cpu = max(0, min(100, base_cpu + np.random.normal(0, 2)))
        ram = max(0, min(100, base_ram + np.random.normal(0, 1)))
        net = max(0, min(100, base_net + np.random.normal(0, 5)))
        
        return {"cpu": round(cpu, 2), "ram": round(ram, 2), "network": round(net, 2)}

sim_engine = SimulationEngine()

# --- Models & Schemas ---
class LogInput(BaseModel):
    log: str

class ScenarioInput(BaseModel):
    scenario: str

class DeviceInfo(BaseModel):
    name: str
    type: str

RECOMMENDATIONS = {
    "CPU problem": ["Check for runaway processes", "Scale up CPU resources", "Check cooling status"],
    "Disk problem": ["Clean temporary files", "Delete old logs", "Increase disk size"],
    "Network problem": ["Reset network interface", "Check firewall rules", "Contact ISP/Network admin"],
    "Service crash": ["Restart service", "Check service logs", "Check dependencies"],
    "Security attack": ["Blocked suspicious IP", "Update firewall rules", "Check for vulnerabilities"],
    "RAM problem": ["Check for memory leaks", "Increase swap space", "Add more RAM"],
    "Normal": ["System healthy", "No action needed"]
}

SEVERITY = {
    "CPU problem": "warning",
    "Disk problem": "critical",
    "Network problem": "critical",
    "Service crash": "critical",
    "Security attack": "critical",
    "RAM problem": "warning",
    "Normal": "normal"
}

@app.post("/predict")
async def predict_log(data: LogInput):
    if not log_model or not vectorizer:
        raise HTTPException(status_code=500, detail="Log classification model not loaded")
    X = vectorizer.transform([data.log])
    problem = log_model.predict(X)[0]
    return {
        "problem": problem,
        "severity": SEVERITY.get(problem, "normal"),
        "recommendation": RECOMMENDATIONS.get(problem, ["Consult documentation"])
    }

@app.post("/scenario")
async def set_scenario(data: ScenarioInput):
    sim_engine.set_scenario(data.scenario)
    return {"status": "Scenario updated to " + data.scenario}

@app.post("/metrics/all")
async def get_all_metrics(devices: List[DeviceInfo]):
    return {d.name: sim_engine.get_metrics(d.name, d.type) for d in devices}

@app.get("/health")
async def health_check():
    return {"status": "ok", "current_scenario": sim_engine.scenario}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
