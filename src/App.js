import React, { useState, useEffect, useCallback } from "react";
import Config from "./Config";
import CanvasGrid from "./Grid";
import Catalogue from "./Catalogue";
import { buildMatrix, REDUCER } from "./utils";

let size = 50;
const threshold = 0.66;
const initialMatrix = buildMatrix(REDUCER.random({ size, threshold }));

function App() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [config, setConfig] = useState({
    stepCount: 1,
    stopped: false,
    isDrawing: true,
    dead: false,
    pattern: [[1]],
    borders: false,
    size: 15,
    delay: 100,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const { stopped, dead, borders, stepCount } = config;
      if (stopped || dead) return;
      const [nextMatrix, isDead] = buildMatrix(
        REDUCER.stepwise({ matrix, borders })
      );
      setMatrix(nextMatrix);
      setConfig({
        ...config,
        dead: isDead,
        stepCount: stepCount + 1,
      });
    }, config.delay);

    return () => clearInterval(interval);
  });

  const onConfigChange = useCallback(
    ({ action }) => {
      let c = { dead: false };
      switch (action) {
        case "stop":
          c.stopped = true;
          break;
        case "start":
          c.stopped = false;
          break;
        case "restart":
          setMatrix(buildMatrix(REDUCER.random({ size, threshold })));
          c.stepCount = 1;
          break;
        case "clear":
          setMatrix(buildMatrix(REDUCER.empty({ size })));
          c.stepCount = 1;
          c.dead = true;
          break;
        case "draw:toggle":
          c.isDrawing = !config.isDrawing;
          break;
        case "borders:toggle":
          c.borders = !config.borders;
          break;
        default:
          break;
      }

      setConfig({
        ...config,
        ...c,
      });
    },
    [config]
  );

  const onGridClick = useCallback(
    (location, pattern) => {
      const [m, isDead] = buildMatrix(
        REDUCER.edit({
          location,
          pattern,
          matrix,
        })
      );
      setMatrix(m);
      setConfig({
        ...config,
        dead: isDead,
      });
    },
    [config, matrix]
  );

  const onCatalogueClick = useCallback(
    ({ pattern }) => {
      setConfig({
        ...config,
        pattern,
      });
    },
    [config]
  );

  return (
    <main className="p-4 w-screen h-screen grid grid-cols-2 gap-4 bg-gray-200">
      <div className="">
        <h1 className="inline-block px-4 mb-3 text-4xl bg-gray-100 shadow-md">
          Conway's Game of Life
        </h1>
        <div className="bg-gray-100 shadow-md mb-3">
          <Config config={config} onChange={onConfigChange} />
        </div>
        <div className="bg-gray-100 shadow-md">
          <Catalogue onClick={onCatalogueClick} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div style={{ minWidth: 750 }} className="p-4 bg-gray-100 shadow-lg">
          <CanvasGrid matrix={matrix} config={config} onClick={onGridClick} />
        </div>
      </div>
    </main>
  );
}

export default App;
