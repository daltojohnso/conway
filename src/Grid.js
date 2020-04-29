import React, {useRef, useEffect} from 'react';
import Cell from './Cell';

const Grid = ({matrix}) => {
  const grid = matrix.map((row, i) => {
    return (
      <div className="flex flex-row" key={i}>
        {row.map((alive, j) => <Cell alive={alive} key={j} />)}
      </div>
    )
  });
  return <div className="flex flex-col">{grid}</div>;
};

export default Grid;

const gridlines = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
     <defs>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5" />
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="url(#smallGrid)" />
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" />
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#smallGrid)" />
</svg>`;

export const CanvasGrid = ({matrix}) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const img = new Image();
        const svg = new Blob([gridlines], { type: 'image/svg+xml;charset=utf-8' });
        const url = window.URL.createObjectURL(svg);
        img.src = url;
        img.onload = function () {
            const ctx = canvasRef.current.getContext('2d');
            ctx.drawImage(img, 0, 0);
            window.URL.revokeObjectURL(url);
        }

    }, []);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        matrix.forEach((row, i) => {
            row.forEach((alive, j) => {
                if (alive) {
                    ctx.fillRect((i * 10) + 1, (j * 10) + 1, 8, 8);
                } else {
                    ctx.clearRect((i * 10) + 1, (j * 10) + 1, 8, 8);
                }
            })
        })
    }, [matrix])
    return <canvas ref={canvasRef} id="grid" width="500" height="500"></canvas>
}
