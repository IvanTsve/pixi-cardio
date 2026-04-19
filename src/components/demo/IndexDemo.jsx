import { Application } from '@pixi/react';
import { Assets } from 'pixi.js';
import { useEffect, useState } from 'react';
import Reels from './Reels';

const REELS_COLS = 4;

export default function IndexDemo() {
    const [textures, setTextures] = useState([]);
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

    return (
    <Application width={800} height={700} defaultTextStyle={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
       {
        Array.from({ length: REELS_COLS }).map((_, index) => (
            <Reels key={index} slotImages={textures} colsIndex={index} />
        ))
       }
        <pixiText
            text="Play"
            position={{ x: 300, y: 650 }}
            eventMode="static"
            cursor="pointer"
            style={{ fontSize: 24, fontWeight: 'bold', fill: '#fff' }}
            onClick={() => {
                console.log('Play');
            }}
        />

    </Application>
    )
}