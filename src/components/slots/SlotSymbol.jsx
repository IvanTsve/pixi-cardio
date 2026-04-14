import { Sprite, Container } from 'pixi.js';
import { extend } from '@pixi/react';

        

extend({
    Sprite,
    Container,
});

export default function SlotSymbol({ position, texture }) {
    return (
            <pixiSprite
                texture={texture}  as any
                width={50}
                height={50}
                anchor={0.5}
                position={position}
            />
    );
}