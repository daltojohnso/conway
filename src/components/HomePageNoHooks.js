import React from "react";
import Config from "./Config";
import CanvasGrid from "./Grid";
import Catalogue from "./Catalogue";

import { buildMatrix, REDUCER } from "../utils";
let size = 50;
const threshold = 0.66;
const initialMatrix = buildMatrix(REDUCER.random({ size, threshold }));

class AppNoHooks extends React.Component {
  constructor() {
    super();

    this.state = {
      matrix: initialMatrix,
      config: {
        stepCount: 1,
        stopped: true,
        isDrawing: true,
        dead: false,
        pattern: [[1]],
        borders: false,
        size: 15,
        delay: 100,
      },
    };

    this.onConfigChange = this.onConfigChange.bind(this);
    this.onCatalogueItemClick = this.onCatalogueItemClick.bind(this);
    this.onGridClick = this.onGridClick.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      const { matrix, config } = this.state;
      if (config.stopped || config.dead) return;
      this.setNextStepOfGame(matrix, config);
    }, this.state.config.delay);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  setNextStepOfGame(matrix, config) {
    const { borders, stepCount } = config;
    const [nextMatrix, isDead] = buildMatrix(
      REDUCER.stepwise({ matrix, borders })
    );

    this.setState({
      matrix: nextMatrix,
      config: {
        ...this.state.config,
        dead: isDead,
        stepCount: stepCount + 1,
      },
    });
  }

  mergeConfig(partialConfig) {
    this.setState({
      config: {
        ...this.state.config,
        ...partialConfig,
      },
    });
  }

  onConfigChange({ action }) {
    const { config } = this.state;
    switch (action) {
      case "stop":
        this.mergeConfig({
          stopped: true,
        });
        break;
      case "start":
        this.mergeConfig({
          stopped: false,
        });
        break;
      case "restart":
        this.setState({
          matrix: buildMatrix(REDUCER.random({ size, threshold })),
          config: {
            ...config,
            stepCount: 1,
            dead: false,
          },
        });
        break;
      case "clear":
        this.setState({
          matrix: buildMatrix(REDUCER.empty({ size })),
          config: {
            ...config,
            stepCount: 1,
            dead: true,
            stopped: true,
          },
        });
        break;
      case "draw:toggle":
        this.mergeConfig({
          isDrawing: !config.isDrawing,
        });
        break;
      case "borders:toggle":
        this.mergeConfig({
          borders: !config.borders,
        });
        break;
      default:
        break;
    }
  }

  onCatalogueItemClick(pattern) {
    this.mergeConfig({
      pattern,
    });
  }

  onGridClick(location, pattern) {
    const { matrix, config } = this.state;
    const [m, isDead] = buildMatrix(
      REDUCER.edit({
        location,
        pattern,
        matrix,
      })
    );

    this.setState({
      matrix: m,
      config: {
        ...config,
        dead: isDead,
      },
    });
  }

  render() {
    const { config, matrix } = this.state;

    return (
      <main className="p-4 w-screen h-screen flex flex-col flex-wrap gap-2 bg-gray-400 items-start justify-start">
        <div className="bg-gray-100 shadow-md flex items-start">
          <div className="">
            <Config config={config} onChange={this.onConfigChange} />
          </div>
          <div className="">
            <Catalogue onClick={this.onCatalogueClick} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div style={{ minWidth: 750 }} className="p-4 bg-gray-100 shadow-lg">
            <CanvasGrid
              matrix={matrix}
              config={config}
              onClick={this.onGridClick}
            />
          </div>
        </div>
      </main>
    );
  }
}

export default AppNoHooks;
