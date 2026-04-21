import { Application } from '@pixi/react';
import { Assets } from 'pixi.js';
import { useEffect, useState } from 'react';
import Reels from './Reels';
import { v4 as uuidv4 } from "uuid";
import isWining from './isWining';

const REELS_COLS = 4;
const VISIBLE_ROWS = 4;
const SYMBOL_H = 128;
const GAP = 20;
const REEL_STEP = 150;
const REELS_OFFSET_X = 100;
const REELS_OFFSET_Y = 50;

const TOTAL_REEL_WIDTH = (REELS_COLS - 1) * REEL_STEP + SYMBOL_H;
const STATUS_X = REELS_OFFSET_X + TOTAL_REEL_WIDTH / 2;
const STATUS_Y = REELS_OFFSET_Y + VISIBLE_ROWS * (SYMBOL_H + GAP) + 28;
const PLAY_X = STATUS_X;
const PLAY_Y = STATUS_Y + 70;

const SHADOW_ANGLE = Math.PI / 4;

const STATUS_CONFIG = {
    idle: {
        text: 'Press Play to Spin!',
        fill: '#aaaaaa',
        stroke: { color: '#222222', width: 3 },
        dropShadow: { color: '#000000', blur: 4, distance: 2, angle: SHADOW_ANGLE },
    },
    spinning: {
        text: 'Spinning...',
        fill: '#ffffff',
        stroke: { color: '#0277bd', width: 5 },
        dropShadow: { color: '#0288d1', blur: 12, distance: 3, angle: SHADOW_ANGLE },
    },
    win: {
        text: 'You Win!',
        fill: '#ffd700',
        stroke: { color: '#2e7d32', width: 5 },
        dropShadow: { color: '#388e3c', blur: 12, distance: 3, angle: SHADOW_ANGLE },
    },
    lose: {
        text: 'Try Again',
        fill: '#ef5350',
        stroke: { color: '#757575', width: 5 },
        dropShadow: { color: '#000000', blur: 6, distance: 2, angle: SHADOW_ANGLE },
    },
};

export default function IndexDemo() {
    const [textures, setTextures] = useState([]);
    const [isSpinning, setIsSpinning] = useState([false, false, false, false]);
    const [reelResult, setReelResult] = useState([]);
    const [spinState, setSpinState] = useState('idle');
    const [winResult, setWinResult] = useState([]);
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
                return { id, texture: el };
            });
            setTextures(mapped);
        });
        return () => { setted = true; };
    }, []);

    useEffect(() => {
        if (reelResult.length === REELS_COLS) {
            const symbols = reelResult.map(col => col.map(el => el.texture.symbol));
            const isWin = isWining(symbols);
            setWinResult(isWin);
            setSpinState(isWin ? 'win' : 'lose');
        }
    }, [reelResult]);

    function handleSpinClick() {
        setReelResult([]);
        setWinResult([]);
        setSpinState('spinning');
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

    const { text, fill, stroke, dropShadow } = STATUS_CONFIG[spinState];

    return (
        <Application width={800} height={800} defaultTextStyle={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
            {
                Array.from({ length: REELS_COLS }).map((_, index) => (
                    <Reels key={index} slotImages={textures} colsIndex={index} isSpinning={isSpinning[index]} VISIBLE_ROWS={VISIBLE_ROWS} handleReelResult={handleReelResult} winResult={winResult} />
                ))
            }

            <pixiText
                text={text}
                anchor={{ x: 0.5, y: 0 }}
                position={{ x: STATUS_X, y: STATUS_Y }}
                style={{
                    fontSize: 40,
                    fontWeight: 'bold',
                    fill,
                    stroke,
                    dropShadow,
                }}
            />

            <pixiText
                text="PLAY"
                anchor={{ x: 0.5, y: 0 }}
                position={{ x: PLAY_X, y: PLAY_Y }}
                eventMode="static"
                cursor="pointer"
                style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    fill: '#ffffff',
                    stroke: { color: '#333333', width: 4 },
                    dropShadow: { color: '#000000', blur: 6, distance: 2, angle: SHADOW_ANGLE },
                }}
                onClick={handleSpinClick}
            />
        </Application>
    );
}