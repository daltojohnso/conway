import React, {useCallback} from 'react';
import { FiPauseCircle, FiPlayCircle, FiRotateCw, FiXCircle} from 'react-icons/fi';

const Config = ({
    config: {
        stopped,
        stepCount
    },
    onChange
}) => {
    const onStopStart = useCallback(() => {
        onChange({action: stopped ? 'start' : 'stop'});
    }, [onChange, stopped])

    const onClear = useCallback(() => {
        onChange({action: 'clear'});
    }, [onChange]);

    const onRestart = useCallback(() => {
        onChange({action: 'restart'});
    }, [onChange]);

    return (
        <div className="grid grid-cols-1 grid-rows-2 gap-4 p-4">
            <div className="inline-flex">
                <button onClick={onStopStart} className="mr-2 inline-flex justify-center items-center text-2xl bg-transparent hover:bg-gray-300 py-1 px-2 border border-gray-600 hover:border-transparent rounded">
                    {stopped ? [
                        <FiPlayCircle className="mr-2 text-3xl text-green-600" key="FiPlayCircle"/>,
                        <span key="Start">Start</span>
                    ] : [
                        <FiPauseCircle className="mr-2 text-3xl text-red-600" key="FiPauseCircle" />,
                        <span key="Stop">Stop</span>
                    ]}
                </button>
                <button onClick={onClear} className="mr-2 inline-flex justify-center items-center text-2xl bg-transparent hover:bg-gray-300 py-1 px-2 border border-gray-600 hover:border-transparent rounded">
                    <FiXCircle className="mr-2 text-3xl" />
                    <span>Clear</span>
                </button>
                <button onClick={onRestart} className="mr-2 inline-flex justify-center items-center text-2xl bg-transparent hover:bg-gray-300 py-1 px-2 border border-gray-600 hover:border-transparent rounded">
                    <FiRotateCw className="mr-2 text-3xl" />
                    <span>Restart</span>
                </button>
            </div>
            <div>
                <label className="text-2xl">
                    Step:&nbsp;&nbsp;
                    <input type="number" readOnly={!stopped} value={stepCount} />
                </label>
            </div>
        </div>
    )
}

export default Config;
