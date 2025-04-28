from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
from PIL import Image
import numpy as np
import io
from .models import load_model, predict
import os
from datetime import datetime
import shutil


app = FastAPI(title="Wheat Disease Detection")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load model at startup
model = load_model()


@app.post("/predict/")
async def predict_disease(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Ensure static directory exists
    os.makedirs("static", exist_ok=True)
    
    # Create unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_ext = file.filename.split(".")[-1]
    filename = f"wheat_{timestamp}.{file_ext}"
    file_path = os.path.join("static", filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    
    # Process image
    try:
        image = Image.open(file_path)
        image = image.resize((300, 300))
        # Convert image to RGB to remove alpha channel if present
        image = image.convert('RGB')  # <-- Add this line
        image_array = np.array(image)
        image_array = np.expand_dims(image_array, axis=0)
        image_array = image_array / 255.0
        
        # Make prediction
        prediction = predict(model, image_array)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
    return {
        "status": "success",
        "prediction": {
            "class": prediction["class"],
            "confidence": float(prediction["confidence"]),
            "all_predictions": prediction["all_predictions"]
        },
        "image_url": f"/static/{filename}"  # This will now be correct
    }
@app.get("/")
def read_root():
    return {"message": "Wheat Disease Detection API"}