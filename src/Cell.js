import React from 'react';
import classnames from 'classnames';

const Cell = ({alive}) => {
  return <div
    style={{height: '10px', width: '10px'}}
    className={classnames('border border-black border-1', {'bg-black': alive})} />
};

export default Cell;
