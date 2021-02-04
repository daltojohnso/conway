import React, { useRef, useEffect, useState, useCallback } from "react";

//https://useworker.js.org/docs/installation/
const gridlines = (
  size
) => `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
     <defs>
        <pattern id="smallGrid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
            <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="gray" stroke-width="0.5" />
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#smallGrid)" />
</svg>`;

const CanvasGrid = ({
  matrix,
  onClick,
  config: { stop, size, isDrawing, pattern },
}) => {
  const width = size * 50 + 1;
  const canvasRef = useRef(null);
  const hoverRef = useRef(null);
  const [xy, setXY] = useState([-1, -1]);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = new Image();
    const svg = new Blob([gridlines(size)], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = window.URL.createObjectURL(svg);
    img.src = url;
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      window.URL.revokeObjectURL(url);
    };
  }, [size]);

  const onMousedown = useCallback(
    (e) => {
      setIsClicking(true);
      const { offsetX, offsetY } = e;
      const x = (offsetX / size) | 0;
      const y = (offsetY / size) | 0;
      setXY([x, y]);
      if (pattern) onClick([x, y], pattern);
    },
    [onClick, pattern, size]
  );

  const onMouseover = useCallback(
    (e) => {
      const hoverCanvas = hoverRef.current;
      const { offsetX, offsetY } = e;
      const x = (offsetX / size) | 0;
      const y = (offsetY / size) | 0;
      const [X, Y] = xy;
      if (x !== X || y !== Y) {
        clearHover(hoverCanvas, xy, width);
        // drawHover(hoverCanvas, [x, y], size);
        setXY([x, y]);
        if (pattern)
          drawPatternHover(hoverCanvas, matrix, [x, y], pattern, size);
        if (isClicking && pattern) onClick([x, y], pattern);
      }
    },
    [onClick, isClicking, matrix, pattern, size, width, xy]
  );

  const onMouseup = useCallback(() => {
    setIsClicking(false);
    setXY([-1, -1]);
  }, []);

  const onMouseout = useCallback(() => {
    const canvas = hoverRef.current;
    clearHover(canvas, xy, width);
  }, [width, xy]);

  useEffect(() => {
    if (!isDrawing) return;

    const canvas = hoverRef.current;
    canvas.addEventListener("mousedown", onMousedown);
    canvas.addEventListener("mousemove", onMouseover);
    canvas.addEventListener("mouseout", onMouseout);
    document.addEventListener("mouseup", onMouseup);

    return () => {
      canvas.removeEventListener("mousedown", onMousedown);
      canvas.removeEventListener("mousemove", onMouseover);
      canvas.removeEventListener("mouseout", onMouseout);
      document.removeEventListener("mouseup", onMouseup);
    };
  }, [isDrawing, onMousedown, onMouseout, onMouseover, onMouseup]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    matrix.forEach((row, i) => {
      row.forEach((alive, j) => {
        if (alive) {
          ctx.fillRect(i * size + 1, j * size + 1, size - 2, size - 2);
        } else {
          ctx.clearRect(i * size + 1, j * size + 1, size - 2, size - 2);
        }
      });
    });
  }, [matrix, size]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} id="grid" width={width} height={width} />
      <canvas
        ref={hoverRef}
        id="hover"
        className="absolute top-0"
        width={width}
        height={width}
      />
    </div>
  );
};

function clearHover(canvas, [x, y], width) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, width);
}

function drawPatternHover(canvas, matrix, [x, y], pattern, size) {
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "red";
  pattern.forEach((row, i) => {
    row.forEach((state, j) => {
      const xi = x + i;
      const yj = y + j;
      if (matrix[xi] != null && matrix[xi][yj] != null) {
        ctx.fillRect(xi * size, yj * size, size, size);
        if (state) ctx.fillRect(xi * size, yj * size, size, size);
      }
    });
  });
}

export default CanvasGrid;
