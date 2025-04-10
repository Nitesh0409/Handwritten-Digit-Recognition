

"use client";

import {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import "./DrawingCanvas.css";

const DrawingCanvas = forwardRef(({ onPredict }, ref) => {
  const canvasRef = useRef(null); // Reference to the main drawing canvas
  const previewCanvasRef = useRef(null); // Reference to the preview (28x28) canvas
  const [isDrawing, setIsDrawing] = useState(false); // Track if the user is drawing
  const [ctx, setCtx] = useState(null); // Store the main canvas context
  const [previewCtx, setPreviewCtx] = useState(null); // Store the preview canvas context

  // Initialize the main drawing canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas background to white
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Configure drawing style
    context.lineWidth = 11;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "white";

    setCtx(context);
  }, []);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set background to white
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    setPreviewCtx(context);
  }, []);

  // Update the preview canvas when drawing stops
  useEffect(() => {
    if (!isDrawing) {
      updatePreviewCanvas();
    }
  }, [isDrawing]);

  // Function to clear both the main and preview canvas
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;

    // Clear the main canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Clear the preview canvas
    if (previewCtx && previewCanvasRef.current) {
      previewCtx.fillStyle = "black";
      previewCtx.fillRect(
        0,
        0,
        previewCanvasRef.current.width,
        previewCanvasRef.current.height
      );
    }
  };

  // Expose clearCanvas function to the parent component
  useImperativeHandle(ref, () => ({
    clearCanvas,
    processCanvas, // <-- Exposing processCanvas
  }));

  // Start drawing on mouse or touch event
  const startDrawing = (e) => {
    if (!ctx) return;
    setIsDrawing(true);

    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  // Draw on the canvas when moving the mouse or touching
  const draw = (e) => {
    if (!isDrawing || !ctx) return;

    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  // Stop drawing and update the preview canvas
  const stopDrawing = () => {
    if (!ctx) return;
    setIsDrawing(false);
    ctx.closePath();
    updatePreviewCanvas();
  };

  // Update the preview canvas with a scaled-down 28x28 version of the main canvas
  const updatePreviewCanvas = () => {
    if (!canvasRef.current || !previewCtx || !previewCanvasRef.current) return;

    // Clear preview canvas
    previewCtx.fillStyle = "white";
    previewCtx.fillRect(
      0,
      0,
      previewCanvasRef.current.width,
      previewCanvasRef.current.height
    );

    // Copy and scale the main canvas content into the preview canvas
    previewCtx.drawImage(
      canvasRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
      0,
      0,
      previewCanvasRef.current.width,
      previewCanvasRef.current.height
    );
  };

  // Get accurate drawing coordinates for both mouse and touch events
  const getCoordinates = (e) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      // For touch events
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    } else {
      // For mouse events
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      };
    }
  };

  // Process the drawn image to a 28x28 grayscale version and send it for prediction
  const processCanvas = () => {
    if (!canvasRef.current || !ctx) return;

    // Convert canvas content to base64 image
    const base64Image = canvasRef.current.toDataURL("image/png");

    // Create a temporary 28x28 canvas for processing
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Copy and scale down the main canvas content to 28x28
    tempCtx.filter = "blur(0.5px)";
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, 28, 28);
    tempCtx.drawImage(
      canvasRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
      0,
      0,
      28,
      28
    );

    // Extract image data and normalize it
    const imageData = tempCtx.getImageData(0, 0, 28, 28);
    const data = imageData.data;

    // Convert RGBA image data to grayscale and normalize values (0-1)
    const normalizedData = [];
    for (let i = 0; i < data.length; i += 4) {
      // Convert RGB to grayscale and normalize
      const pixelValue = data[i] / 255;
      normalizedData.push(pixelValue);
    }

    // Pass the processed data and base64 image to the prediction function
    onPredict(normalizedData, base64Image);
  };

  return (
    <div className="drawing-container">
      <div className="canvas-wrapper">
        {/* Main Canvas for Drawing */}
        <div className="main-canvas-container">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="drawing-canvas"
          />
        </div>

        {/* Preview Canvas */}
        <div className="preview-container">
          <h3>28×28 Preview</h3>
          <div className="preview-canvas-container">
            <canvas
              ref={previewCanvasRef}
              width={112}
              height={112}
              className="preview-canvas"
            />
          </div>
          <p className="preview-hint">
            This is 28x28 view of digit
          </p>
        </div>
      </div>

      {/* Process Button (Triggers Prediction) */}
      <button
        id="predict-button"
        onClick={processCanvas}
        className="hidden-button"
      >
        Process
      </button>
    </div>
  );
});

export default DrawingCanvas;


