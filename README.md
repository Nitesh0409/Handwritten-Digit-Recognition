# Handwritten Digit Recognition

This is a full-stack machine learning web application that predicts handwritten digits using a trained logistic regression model.

**Live Demo:** [https://handwritten-digit-recognition-vjhi.vercel.app/](https://handwritten-digit-recognition-vjhi.vercel.app/)

## Overview

Users can draw digits (0–9) on a canvas, and the model will predict the digit with associated confidence scores. The application demonstrates how digits can be recognized using machine learning, similar to digit classification tasks in OCR systems.

## Tech Stack

- **Frontend:** React (Create React App)
- **Backend:** Python (Flask)
- **Machine Learning Model:** Logistic Regression trained on MNIST
- **Deployment Platforms:**
  - Frontend: [Vercel](https://vercel.com)
  - Backend: [Render](https://render.com)

## Features

- Draw a digit and receive a predicted class.
- Visualize prediction probabilities for all digit classes.
- Clean and responsive user interface.
- Entire model built and trained using NumPy (no Scikit-learn).

## How It Works

1. The user draws a digit using a canvas on the frontend.
2. The image is converted into a 28x28 grayscale format.
3. The processed image data is sent to the Flask backend.
4. The backend applies a logistic regression model to classify the digit.
5. The predicted result and class probabilities are returned to the frontend.

## Machine Learning Model

- Dataset: MNIST (28x28 grayscale images of handwritten digits)
- Model:  Logistic Regression (softmax algorithm)
- Tools: NumPy, Pillow (PIL), Flask
---

## Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### frontend
npm install
npm start


