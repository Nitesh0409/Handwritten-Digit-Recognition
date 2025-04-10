import { useState, useRef } from "react";
import DrawingCanvas from "./components/DrawingCanvas";
import PredictionResults from "./components/PredictionResults";
import "./App.css";

function App() {
  const drawingCanvasRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (imageData, base64Image) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_data: base64Image,
          data: imageData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      console.error("Error predicting:", err);
      setError(err instanceof Error ? err.message : "Failed to get prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrediction(null);
    setError(null);

    if (drawingCanvasRef.current) {
      drawingCanvasRef.current.clearCanvas(); 
    }
  };

  return (
    <div className="app">
      <div className="app-background"></div>
      <div className="app-container">
        <header className="app-header">
          <h1>Digit Prediction</h1>
          <p className="subtitle">
            Draw any digit and our ML model will try to recognize it
          </p>
          <p className="note">
            ⚠️ Note: The model is trained on MNIST data, so predictions from
            hand-drawn digits may vary due to differences in stroke, size, and
            clarity. For better results, try to draw the digit in the center of
            the canvas.
          </p>
        </header>

        <main className="app-content">
          <section className="drawing-section">
            <div className="card">
              <div className="card-header">
                <h2>Draw a Digit</h2>
                <p>Draw a single digit (0-9) in the canvas below</p>
              </div>
              <div className="card-content">
                <DrawingCanvas
                  ref={drawingCanvasRef} 
                  onPredict={handlePredict}
                  onClear={handleClear}
                />

                <div className="button-group">
                  <button
                    className="button button-secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    className="button button-primary"
                    onClick={() => {
                      if (drawingCanvasRef.current) {
                        drawingCanvasRef.current.processCanvas();
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      "Predict"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="results-section">
            <div className="card">
              <div className="card-header">
                <h2>Prediction Results</h2>
                <p>The model's prediction and confidence levels</p>
              </div>
              <div className="card-content">
                {error ? (
                  <div className="error-message">
                    <p>Error: {error}</p>
                    <p className="error-hint">
                      Make sure your server is running at http://127.0.0.1:5000
                    </p>
                  </div>
                ) : prediction ? (
                  <PredictionResults prediction={prediction} />
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">?</div>
                    <p>Draw a digit and click "Predict" to see results</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        <footer className="app-footer">
          <p>Thanks for you time !!! 😊</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
