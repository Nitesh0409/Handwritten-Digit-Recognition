# Handwritten Digit Recognition – Web Application

An interactive web application that recognizes handwritten digits drawn by the user and returns real-time predictions from a trained machine learning model.

Live Demo:  
[https://handwritten-digit-recognition-vjhi.vercel.app/](https://handwritten-digit-recognition-vjhi.vercel.app/)

---

## What This App Does

- Accepts handwritten digit input via a drawing canvas
- Processes the input into a model-ready format
- Returns the predicted digit with class confidence scores

---

## Stack

- React (frontend)
- Flask (backend API)
- Logistic Regression model trained on MNIST
- NumPy-based implementation (no scikit-learn)

---

## Flow

Canvas Input → Image Processing → Backend Inference → Prediction Response

---

## Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```
npm install
npm start
```

---

## Notes

This repository focuses on model integration and deployment.
Detailed methodology and analysis are documented on the project webpage.
---
