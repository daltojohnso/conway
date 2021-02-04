import React, { useRef, useEffect, useState, useCallback } from "react";
import { LineChart as DcLineChart } from "dc";
import { countLivingCells } from "./utils";

function LineChart({ matrix, config }) {
  const elRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    chartRef.current = new DcLineChart(elRef.current);
  }, []);

  useEffect(() => {}, [config.stepCount]);

  return <div ref={elRef} />;
}

export default LineChart;
