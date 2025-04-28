from tensorflow.keras.models import load_model as keras_load_model
import numpy as np
import os

# Define your disease classes
CLASS_NAMES = ["Healthy", "Disease1", "Disease2", "Disease3"]  # Update with your actual classes

def load_model(model_path: str = "my_model.h5"):
    """
    Load the trained Keras model
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    return keras_load_model(model_path)

def predict(model, image_array):
    """
    Make prediction on the input image
    """
    # Preprocess if needed (normalization, etc.)
    # image_array = image_array / 255.0  # Example normalization
    
    predictions = model.predict(image_array)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]))
    
    return {
        "class": predicted_class,
        "confidence": confidence,
        "all_predictions": dict(zip(CLASS_NAMES, predictions[0].tolist()))
    }