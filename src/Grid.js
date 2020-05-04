import React, {useRef, useEffect, useState, useCallback} from 'react';
import Cell from './Cell';

export const DivGrid = ({matrix}) => {
  const grid = matrix.map((row, i) => {
    return (
      <div className="flex flex-row" key={i}>
        {row.map((alive, j) => <Cell alive={alive} key={j} />)}
      </div>
    )
  });
  return <div className="flex flex-col">{grid}</div>;
};

const gridlines = size => `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
     <defs>
        <pattern id="smallGrid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
            <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="gray" stroke-width="0.5" />
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#smallGrid)" />
</svg>`;

export const CanvasGrid = ({matrix, flip, stop, size, isDrawing}) => {
    const canvasRef = useRef(null);
    const [xy, setXY] = useState([-1, -1]);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const img = new Image();
        const svg = new Blob([gridlines(size)], { type: 'image/svg+xml;charset=utf-8' });
        const url = window.URL.createObjectURL(svg);
        img.src = url;
        img.onload = () => {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            window.URL.revokeObjectURL(url);
        }
    }, [size]);

    const onMousedown = useCallback(e => {
        setIsClicking(true);
        console.log(e);
        const {offsetX, offsetY} = e;
        const x = offsetX / size | 0;
        const y = offsetY / size | 0;
        setXY([x, y]);
        flip(x, y);
    }, [flip, size]);

    const onMouseover = useCallback(e => {
        if (!isClicking) return;

        const {offsetX, offsetY} = e;
        const x = offsetX / size | 0;
        const y = offsetY / size | 0;
        const [X, Y] = xy;
        if (x !== X || y !== Y) {
            setXY([x, y]);
            flip(x, y);
        }
    }, [flip, isClicking, size, xy]);

    const onMouseup = useCallback(() => {
        setIsClicking(false);
        setXY([-1, -1]);
    }, []);

    useEffect(() => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', onMousedown);
        canvas.addEventListener('mousemove', onMouseover);
        document.addEventListener('mouseup', onMouseup);

        return () => {
            canvas.removeEventListener('mousedown', onMousedown);
            canvas.removeEventListener('mousemove', onMouseover);
            document.removeEventListener('mouseup', onMouseup);
        };
    }, [isDrawing, onMousedown, onMouseover, onMouseup]);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        matrix.forEach((row, i) => {
            row.forEach((alive, j) => {
                if (alive) {
                    ctx.fillRect((i * size) + 1, (j * size) + 1, size - 2, size - 2);
                } else {
                    ctx.clearRect((i * size) + 1, (j * size) + 1, size - 2, size - 2);
                }
            })
        })
    }, [matrix, size]);

    return <canvas ref={canvasRef} id="grid" width={size * 50 + 1} height={size * 50 + 1}></canvas>
}
