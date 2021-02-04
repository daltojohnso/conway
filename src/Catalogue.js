import React, { useState, useCallback } from "react";
import classnames from "classnames";
const customPattern = [
  [1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0],
  [1, 0, 0, 1, 1],
  [0, 0, 1, 0, 0],
  [1, 0, 1, 1, 1],
];

const Catalogue = ({ onClick }) => {
  const [selected, setSelected] = useState(1);

  const onCatalogueItemClick = ({ id, pattern }) => {
    setSelected(id);
    onClick({ pattern });
  };

  return (
    <div className="p-4 inline-flex flex-wrap">
      <CatalogueUnitItem
        alive
        id="1"
        selected={selected}
        onClick={onCatalogueItemClick}
      />
      <CatalogueUnitItem
        alive={false}
        id="2"
        selected={selected}
        onClick={onCatalogueItemClick}
      />
      <CatalogueItem
        onClick={onCatalogueItemClick}
        id="3"
        selected={selected}
        pattern={customPattern}
      />
    </div>
  );
};

export default Catalogue;

function buildSquare(alive, n) {
  const sq = new Array(n).fill([]);
  sq.forEach((row) => {
    row.length = n;
    row.fill(alive);
  });
  return sq;
}

function CatalogueItem({ onClick, id, selected, pattern }) {
  return (
    <button
      onClick={() => onClick({ id, pattern })}
      className={classnames(
        { "bg-gray-300": selected === id },
        "relative h-32 w-32 m-1 cursor-pointer hover:bg-gray-400 hover:border-0 flex flex-col justify-around items-center w-24 h-20 border border-gray-300"
      )}
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center border-l border-t border-gray-400">
          {pattern.map((row, i) => {
            return (
              <div className="flex flex-col" key={`row-${i}`}>
                {row.map((state, j) => (
                  <div
                    key={`cell-${j}`}
                    className={classnames(
                      state ? "bg-black" : "bg-white",
                      "h-4 w-4 border-r border-b border-gray-400"
                    )}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}

function CatalogueUnitItem({ alive, onClick, id, selected }) {
  const [size, setSize] = useState(1);
  const [pattern, setPattern] = useState(buildSquare(alive, size));

  const incrSize = useCallback(
    (incrAmount) => {
      const newSize = size + incrAmount || 1;
      const newPattern = buildSquare(alive, newSize);
      setSize(newSize);
      setPattern(newPattern);
      onClick({
        id,
        pattern: newPattern,
      });
    },
    [size, onClick, alive, id]
  );

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onClick({ id, pattern })}
        className={classnames(
          { "bg-gray-300": selected === id },
          "relative h-32 w-32 m-1 cursor-pointer hover:bg-gray-400 hover:border-0 flex flex-col justify-around items-center w-24 h-20 border border-gray-300"
        )}
      >
        <div className="flex flex-col items-center">
          <div
            className={classnames(
              alive ? "bg-black" : "bg-white",
              "h-4 w-4  border border-gray-400"
            )}
          ></div>
          {`${size} x ${size}`}
        </div>
      </button>
      <div className="inline-flex">
        <button
          className="w-8 mr-1 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded"
          onClick={() => incrSize(1)}
        >
          +
        </button>
        <button
          className="w-8 mr-1 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded"
          onClick={() => incrSize(-1)}
        >
          -
        </button>
        <button
          className="w-8 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded"
          onClick={() => incrSize(-size + 1)}
        >
          1
        </button>
      </div>
    </div>
  );
}
