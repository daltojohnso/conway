import React, {useState, useCallback} from 'react';
import classnames from 'classnames';

const pattern = [
    [1, 1, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 1, 1, 1]
];

const Catalogue = ({onClick}) => {
    const [blackSquare, setBlackSquare] = useState(1);
    const [whiteSquare, setWhiteSquare] = useState(1);
    const [selected, setSelected] = useState(1);

    const onCardClick = useCallback(e => {
        const cardNum = Number(e.currentTarget.dataset.card);
        setSelected(cardNum);
        switch (cardNum) {
            case 1:
                onClick({pattern: buildSquare(true, blackSquare)});
                break;
            case 2:
                onClick({pattern: buildSquare(false, whiteSquare)});
                break
            default:
                break;
        }
    }, [blackSquare, onClick, whiteSquare]);

    const incrBlackSquare = useCallback(e => {
        e.stopPropagation();
        const incrAmount = Number(e.target.dataset.incr);
        const size = (blackSquare + incrAmount) || 1;
        setBlackSquare(size);
        onClick({
            pattern: buildSquare(true, size)
        });
        setSelected(1);
    }, [blackSquare, onClick]);

    const incrWhiteSquare = useCallback(e => {
        e.stopPropagation();
        const incrAmount = Number(e.target.dataset.incr);
        const size = (whiteSquare + incrAmount) || 1;
        setWhiteSquare(size);
        onClick({
            pattern: buildSquare(false, size)
        });
        setSelected(2);
    }, [onClick, whiteSquare]);

    const onPatternClick = useCallback(e => {
        onClick({
            pattern
        });
        setSelected(3);
    }, [onClick])

    return <div className="p-4 inline-flex flex-wrap">
        <div className="flex flex-col items-center">
            <button onClick={onCardClick} data-card="1" className={classnames({'bg-gray-300': selected === 1}, 'relative h-48 w-32 m-1 cursor-pointer hover:bg-gray-400 hover:border-0 flex flex-col justify-around items-center w-24 h-20 border border-gray-300')}>
                <div className="flex flex-col items-center">
                    <div className="h-4 w-4 bg-black border border-gray-400"></div>
                    {`${blackSquare} x ${blackSquare}`}
                </div>
            </button>
            <div className="inline-flex">
                <button className="w-8 mr-1 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded" data-incr="1" onClick={incrBlackSquare}>+</button>
                <button className="w-8 mr-1 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded" data-incr="-1" onClick={incrBlackSquare}>-</button>
                <button className="w-8 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded" data-incr={-blackSquare + 1} onClick={incrBlackSquare}>1</button>
            </div>
        </div>
        <div className="flex flex-col items-center">
            <button onClick={onCardClick} data-card="2" className={classnames({'bg-gray-300': selected === 2}, 'relative h-48 w-32 m-1 cursor-pointer hover:bg-gray-400 hover:border-0 flex flex-col justify-around items-center w-24 h-20 border border-gray-300')}>
                <div className="flex flex-col items-center">
                    <div className="h-4 w-4 bg-white border border-gray-400"></div>
                    {`${whiteSquare} x ${whiteSquare}`}
                </div>
            </button>
            <div className="inline-flex">
                <button className="w-8 mr-1 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded" data-incr="1" onClick={incrWhiteSquare}>+</button>
                <button className="w-8 mr-1 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded" data-incr="-1" onClick={incrWhiteSquare}>-</button>
                <button className="w-8 text-xl bg-transparent hover:bg-gray-600 hover:text-white px-2 border border-gray-600 hover:border-transparent rounded" data-incr={-whiteSquare + 1} onClick={incrWhiteSquare}>1</button>
            </div>
        </div>
        <button onClick={onPatternClick} data-card="3" className={classnames({'bg-gray-300': selected === 3}, 'relative h-48 w-32 m-1 cursor-pointer hover:bg-gray-400 hover:border-0 flex flex-col justify-around items-center w-24 h-20 border border-gray-300')}>
            <div className="flex flex-col items-center">
                <div className="flex items-center border-l border-t border-gray-400">
                    {pattern.map((row, i) => {
                        return <div className="flex flex-col" key={`row-${i}`}>
                            {row.map((state, j) => <div key={`cell-${j}`} className={classnames(state ? 'bg-black' : 'bg-white', 'h-4 w-4 border-r border-b border-gray-400')}/>)}
                        </div>
                    })}
                </div>
            </div>
        </button>
    </div>
}

export default Catalogue;

function buildSquare (alive, n) {
    const sq = new Array(n).fill([]);
    sq.forEach(row => {
        row.length = n;
        row.fill(alive);
    });
    return sq;
}
