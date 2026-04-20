import { Application } from '@pixi/react';
import { Assets } from 'pixi.js';
import { useEffect, useState } from 'react';
import Reels from './Reels';
import { v4 as uuidv4 } from "uuid";
import wins from './winTable';

const REELS_COLS = 4;
const VISIBLE_ROWS = 4;

export default function IndexDemo() {
    const [textures, setTextures] = useState([]);
    const [isSpinning, setIsSpinning] = useState([false, false, false, false]);
    const [reelResult, setReelResult] = useState([]);
    const [winResult, setWinResult] = useState(false);

    const slotImages = Object.values(
        import.meta.glob('../../assets/slots/*.png', {
            eager: true,
            import: 'default',
        }),
    );

    useEffect(() => {
        let setted = false;

        Assets.load(slotImages).then((textures) => {
            if (setted) return;
            const mapped = Object.values(textures).map(el => {
                const id = uuidv4();
                const match = el.label.match(/\/([^\/]+)\.png$/);
                el['symbol'] = match ? match[1] : null;
                return { id, texture: el }
            });
            setTextures(mapped);
        });
        return () => {
            setted = true;
        }
    }, []);

    useEffect(() => {
        if (reelResult.length === REELS_COLS) {
            console.log(reelResult);
        }
    }, [reelResult]);
    function handleSpinClick() {
        setReelResult([]);
        setTimeout(() => setIsSpinning(prev => [true, prev[1], prev[2], prev[3]]), 150);
        setTimeout(() => setIsSpinning(prev => [prev[0], true, prev[2], prev[3]]), 300);
        setTimeout(() => setIsSpinning(prev => [prev[0], prev[1], true, prev[3]]), 450);
        setTimeout(() => setIsSpinning(prev => [prev[0], prev[1], prev[2], true]), 600);

        setTimeout(() => setIsSpinning(prev => [false, prev[1], prev[2], prev[3]]), 3000);
        setTimeout(() => setIsSpinning(prev => [prev[0], false, prev[2], prev[3]]), 3566);
        setTimeout(() => setIsSpinning(prev => [prev[0], prev[1], false, prev[3]]), 4132);
        setTimeout(() => setIsSpinning(prev => [prev[0], prev[1], prev[2], false]), 4700);
    }

    function handleReelResult(cIndex, result) {
        setReelResult(prev => {
            const results = [...prev];
            results[cIndex] = result;
            return results;
        });
    }

    return (
        <Application width={800} height={3700} defaultTextStyle={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
            {
                Array.from({ length: REELS_COLS }).map((_, index) => (
                    <Reels key={index} slotImages={textures} colsIndex={index} isSpinning={isSpinning[index]} VISIBLE_ROWS={VISIBLE_ROWS} handleReelResult={handleReelResult} />
                ))
            }

            <pixiText
                text={winResult ? "You Win" : "You Lose"}
                visible={reelResult.length === REELS_COLS}
                position={{ x: 300, y: 850 }}
                eventMode="static"
                cursor="pointer"
                style={{ fontSize: 24, fontWeight: 'bold', fill: '#fff' }}
            />
            <pixiText
                text="Play"
                position={{ x: 300, y: 650 }}
                eventMode="static"
                cursor="pointer"
                style={{ fontSize: 24, fontWeight: 'bold', fill: '#fff' }}
                onClick={handleSpinClick}
            />

        </Application>
    )
}