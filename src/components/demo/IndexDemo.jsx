import { Application } from '@pixi/react';
import { Assets } from 'pixi.js';
import { useEffect, useState } from 'react';
import Reels from './Reels';

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
    <Application width={800} height={600} defaultTextStyle={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
       
        <Reels slotImages={textures} />
        <pixiText
            text="Play"
            position={{ x: 300, y: 500 }}
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