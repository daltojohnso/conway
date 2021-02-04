import React, { useState, useCallback } from "react";
import Config from "./Config";
import CanvasGrid from "./Grid";
import Catalogue from "./Catalogue";

import { buildMatrix, REDUCER } from "../utils";
let size = 50;
const threshold = 0.66;
const initialMatrix = buildMatrix(REDUCER.random({ size, threshold }));

function App() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [config, setConfig] = useState({
    stepCount: 1,
    stopped: true,
    isDrawing: true,
    dead: false,
    pattern: [[1]],
    borders: false,
    size: 15,
    delay: 100,
  });

  const mergeConfig = useCallback(
    (partialConfig) => setConfig({ ...config, ...partialConfig }),
    [config]
  );

  function setNextStepOfGame(matrix, config) {
    const { borders, stepCount } = config;
    const [nextMatrix, isDead] = buildMatrix(
      REDUCER.stepwise({ matrix, borders })
    );
    setMatrix(nextMatrix);
    setConfig({
      ...config,
      dead: isDead,
      stepCount: stepCount + 1,
    });
  }

  const onConfigChange = useCallback(
    ({ action }) => {
      switch (action) {
        case "stop":
          mergeConfig({
            stopped: true,
          });
          break;
        case "start":
          mergeConfig({
            stopped: false,
          });
          break;
        case "restart":
          setMatrix(buildMatrix(REDUCER.random({ size, threshold })));
          mergeConfig({
            stepCount: 1,
            dead: false,
          });
          break;
        case "clear":
          setMatrix(buildMatrix(REDUCER.empty({ size })));
          mergeConfig({
            stepCount: 1,
            dead: true,
            stopped: true,
          });
          break;
        case "draw:toggle":
          mergeConfig({
            isDrawing: !config.isDrawing,
          });
          break;
        case "borders:toggle":
          mergeConfig({
            borders: !config.borders,
          });
          break;
        default:
          break;
      }
    },
    [config, mergeConfig]
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
    <main className="p-4 w-screen h-screen flex flex-col flex-wrap gap-2 bg-gray-400 items-start justify-start overflow-auto">
      <div className="bg-gray-100 shadow-md flex items-start">
        <div className="col-start-2">
          <Config config={config} onChange={onConfigChange} />
        </div>
        <div className="">
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
