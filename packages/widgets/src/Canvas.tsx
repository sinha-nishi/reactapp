import React, { useEffect, useRef, useState } from "react";

// TODO: More manipulations from here:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const span = useRef<HTMLSpanElement>(null);
  const [ratio, setRatio] = useState(1);

  const baseWidth = 500;
  const baseHeight = 250;

    /**
   * Draws some sample content onto the canvas.
   * Note: All coordinates are based on the 'base' dimensions (500x250),
   * not the scaled dimensions. The `ctx.scale()` call handles the conversion for us!
   */
  function drawStuff() {
    const canvas = ref.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // Clear the canvas (important when redrawing).
    // We use baseWidth/Height because the context is already scaled.
    ctx.clearRect(0, 0, baseWidth, baseHeight);

    // Draw a rectangle
    ctx.fillStyle = "#E84A5F";
    ctx.fillRect(20, 20, 150, 100);

    // Draw a circle
    ctx.fillStyle = "#47AFAF";
    ctx.beginPath();
    ctx.arc(300, 100, 70, 0, 2 * Math.PI);
    ctx.fill();

    // Draw some text
    ctx.fillStyle = "#333";
    ctx.font = "30px Arial";
    // The text will become sharper at higher DPIs.
    ctx.fillText("Hello, DPI!", 40, 180);

    // Draw a line
    ctx.strokeStyle = "#FF8C42";
    ctx.lineWidth = 5; // The line will maintain its relative thickness.
    ctx.beginPath();
    ctx.moveTo(350, 20);
    ctx.lineTo(480, 230);
    ctx.stroke();
  }

  function setupCanvasAndDraw(dpiRatio: number) {
    const canvas = ref.current;
    console.log("Setting up canvas with DPI ratio:", dpiRatio, "to canvas:", canvas);
    if (!canvas) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Calculate the actual number of pixels the canvas needs.
    const scaledWidth = baseWidth * dpiRatio;
    const scaledHeight = baseHeight * dpiRatio;

    // Set the canvas's internal resolution (drawing surface).
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Set the canvas's display size using CSS. This remains constant.
    canvas.style.width = `${baseWidth}px`;
    canvas.style.height = `${baseHeight}px`;

    // Scale the entire drawing context. All subsequent drawing commands
    // will be scaled by this factor.
    ctx.scale(dpiRatio, dpiRatio);

    // Now, draw the content.
    drawStuff();
  }

  
  useEffect(() => {
    setupCanvasAndDraw(1);
    // 1. Get the device pixel ratio to account for high-DPI screens
    // const dpr = window.devicePixelRatio || 1;

    // // 2. Get the CSS size of the canvas
    // const rect = canvas.getBoundingClientRect();

    // // 3. Set the canvas's internal drawing surface dimensions (pixel count)
    // //    by multiplying the CSS dimensions by the device pixel ratio.
    // canvas.width = rect.width * dpr;
    // canvas.height = rect.height * dpr;

    // // 4. Scale all drawing operations by the device pixel ratio to avoid blurring.
    // //    This ensures that each CSS pixel effectively maps to the correct number of physical pixels.
    // ctx.scale(dpr, dpr);

    // // 5. Draw on the canvas using the scaled context.
    // //    The coordinates here are in CSS pixels, and the scaling will handle the rest.
    // ctx.fillStyle = "blue";
    // ctx.fillRect(0, 0, 200, 100);
    // ctx.fillStyle = "green";
    // ctx.font = "100px Arial";
    // ctx.fillText("A", 60, 80);
  }, []);

  return (
    <div className="canvas-container">
      <div
        style={{
          marginTop: "1.5rem",
          fontSize: "1.2rem",
        }}
      >
        <label
          style={{
            marginRight: "1.5rem",
          }}
          htmlFor="dpiSlider"
        >
          Simulated DPI Ratio:
        </label>
        <input
          style={{
            width: "300px",
            verticalAlign: "middle",
          }}
          onChange={(e) => {
            const newDpi = parseFloat(e.target.value);
            setRatio(newDpi);
            // Update the display text.
            // dpiValueSpan.textContent = `${newDpi.toFixed(1)}x`;
            
            // Redraw the canvas with the new DPI setting.
            setupCanvasAndDraw(newDpi);
          }}

          type="range"
          id="dpiSlider"
          min="1"
          max="4"
          value={ratio}
          step="0.1"
        />
        <span id="dpiValue">{`${ratio}px`}</span>
      </div>
      <canvas
        ref={ref}
        id="myCanvas"
        width="200"
        height="100"
        style={{ border: "1px solid #333" }}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
  );
}
