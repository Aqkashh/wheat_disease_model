# Wheat Disease Detection API

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)

A FastAPI-based backend system for detecting diseases in wheat plants using deep learning.

## 📋 Prerequisites

- Python 3.8+
- [UV](https://github.com/astral-sh/uv) (recommended) or pip
- Virtual environment (venv)
- `my_model.h5` file in the project root directory

## 🚀 Project Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/wheat-disease-detection.git
cd wheat-disease-detection


# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
.\venv\Scripts\activate

# Using UV (recommended)
uv pip install -r requirements.txt

# Alternative using pip
pip install -r requirements.txt

.
├── main.py
├── models.py
├── requirements.txt
├── my_model.h5
├── static/
└── venv/

uvicorn main:app --reload

