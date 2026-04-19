import { Application } from '@pixi/react';
import { Assets } from 'pixi.js';
import { useEffect, useState } from 'react';
import Reels from './Reels';

const REELS_COLS = 4;
const SYMBOL_H = 128;
const SYMBOL_W = 128;
const VISIBLE_ROWS = 4;

export default function IndexDemo() {
    const [textures, setTextures] = useState([]);
    const [isSpinning, setIsSpinning] = useState([false, false, false, false]);

    const slotImages = Object.values(
        import.meta.glob('../../assets/slots/*.png', {
            eager: true,
            import: 'default',
        }),
    );

    useEffect(() => {
    Assets.load(slotImages).then((textures) => {
        setTextures(textures);
    });
    }, []);
    function handleSpinClick() {
        setIsSpinning(prev => [true, true, true, true]);
        setTimeout(() => setIsSpinning(prev => [false, prev[1], prev[2], prev[3]]), 1500);
        setTimeout(() => setIsSpinning(prev => [prev[0], false, prev[2], prev[3]]), 1900);
        setTimeout(() => setIsSpinning(prev => [prev[0], prev[1], false, prev[3]]), 2300);
        setTimeout(() => setIsSpinning(prev => [prev[0], prev[1], prev[2], false]), 2700);
    }

    return (
    <Application width={800} height={700} defaultTextStyle={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
       {
        Array.from({ length: REELS_COLS }).map((_, index) => (
            <Reels key={index} slotImages={textures} colsIndex={index} SYMBOL_H={SYMBOL_H} SYMBOL_W={SYMBOL_W} VISIBLE_ROWS={VISIBLE_ROWS} isSpinning={isSpinning[index]} />
        ))
       }
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