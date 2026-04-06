import SlotSymbol from './SlotSymbol';
import { extend } from '@pixi/react';
import { Graphics } from 'pixi.js';

extend({
    Graphics,
});

export default function SlotReel({ textures, posX }) {
    return (
        <>
        <pixiGraphics
            position={{ x: posX, y: 0 }}
            draw={(graphics) => {
                graphics.clear();
                graphics.setStrokeStyle({ width: 3, color: 0xffffff, alpha: 1 });
                graphics.rect(-35, -35, 70, 250);
                graphics.stroke();
            }}
        />
        {
            Array.from({ length: 3 }).map((_, index) => (
                <SlotSymbol key={index} position={{ x: posX, y: index * 90 }} texture={textures[index]} />
            ))
        }

        </>
    );
}