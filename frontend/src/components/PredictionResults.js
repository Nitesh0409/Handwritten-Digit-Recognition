import "./PredictionResults.css";

function PredictionResults({ prediction }) {
  const { predicted_class, probabilities } = prediction;

  // Sort probabilities for display
  const sortedProbabilities = Object.entries(probabilities)
    .map(([digit, probability]) => ({
      digit: Number.parseInt(digit),
      probability,
    }))
    .sort((a, b) => b.probability - a.probability);

  // Get the highest probability
  const highestProbability = probabilities[predicted_class.toString()];

  // Color class based on confidence
  const getConfidenceClass = () => {
    if (highestProbability > 90) return "high-confidence";
    if (highestProbability > 70) return "medium-confidence";
    return "low-confidence";
  };

  return (
    <div className="prediction-results">
      <div className="prediction-display">
        <div className={`predicted-digit ${getConfidenceClass()}`}>
          {predicted_class}
        </div>
        <div className="confidence-text">
          Predicted with{" "}
          <span className={getConfidenceClass()}>
            {highestProbability.toFixed(2)}%
          </span>{" "}
          confidence
        </div>
      </div>

      <div className="probability-distribution">
        <h3>Probability Distribution</h3>

        <div className="probability-bars">
          {sortedProbabilities.map(({ digit, probability }) => (
            <div key={digit} className="probability-item">
              <div className="probability-header">
                <span
                  className={
                    digit === predicted_class ? getConfidenceClass() : ""
                  }
                >
                  Digit {digit}
                </span>
                <span
                  className={
                    digit === predicted_class ? getConfidenceClass() : ""
                  }
                >
                  {probability.toFixed(2)}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div
                  className={`progress-bar ${
                    digit === predicted_class ? getConfidenceClass() : ""
                  }`}
                  style={{ width: `${Math.max(probability, 0.5)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PredictionResults;
