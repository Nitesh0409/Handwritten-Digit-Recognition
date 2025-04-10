import pickle
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load trained model (Theta_opt)
with open("logistic_model.pkl", "rb") as file:
    Theta_opt = pickle.load(file)

# Ensure saved_images directory exists
os.makedirs("saved_images", exist_ok=True)

# Softmax function
def softmax(Z):
    exp_Z = np.exp(Z - np.max(Z, axis=1, keepdims=True))
    return exp_Z / np.sum(exp_Z, axis=1, keepdims=True)

# Add bias term to input
def add_bias_term(X):
    return np.c_[np.ones((X.shape[0], 1)), X]

# Predict class
def predict_class(X, Theta):
    Z = np.dot(X, Theta)  # Compute raw scores
    probabilities = softmax(Z)
    predicted_class = np.argmax(probabilities, axis=1)
    return predicted_class[0], probabilities

# ✅ Health check route
@app.route("/", methods=["GET"])
def home():
    return "✅ Flask backend is running!", 200

# API endpoint for prediction
@app.route("/predict", methods=["POST"])
def predict_digit():
    try:
        data = request.json
        image_data = data.get("image_data")  # Base64 image
        input_data = data.get("data")  # 784 pixel values
        print(f"input data = {input_data}")

        # Process image (optional)
        if image_data:
            img_bytes = base64.b64decode(image_data.split(",")[1])
            img = Image.open(io.BytesIO(img_bytes)).convert("L")

            # Save original image
            img.save("saved_images/saved_image_original.png")

            # Resize to 28x28
            img_resized = img.resize((28, 28), Image.Resampling.LANCZOS)
            img_resized.save("saved_images/saved_image_28x28.png")

        if not input_data or len(input_data) != 784:
            return jsonify({"error": "Invalid input data size"}), 400

        X_input = np.array(input_data).reshape(1, -1)
        X_input_bias = add_bias_term(X_input)

        y_pred, P_test = predict_class(X_input_bias, Theta_opt)

        response = {
            "predicted_class": int(y_pred),
            "probabilities": {
                str(i): round(float(prob * 100), 2)
                for i, prob in enumerate(P_test[0])
            }
        }
        return jsonify(response)

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 400

# Run Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
