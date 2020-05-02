import React from 'react';

const Config = ({
    config: {
        stopped,
        stepCount
    },
    onChange
}) => {
    const onClick = e => {
        e.preventDefault();
        onChange({stopped: !stopped, stepCount});
    };

    return (
        <form className="">
            <label>
                Step:&nbsp;&nbsp;
                <input type="number" readOnly value={stepCount} />
            </label>
            <button onClick={onClick} className="">
                {stopped ? 'Start' : 'Stop'}
            </button>
        </form>
    )
}

export default Config;
