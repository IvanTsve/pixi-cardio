import { Application, Sprite, Container, Texture, Assets } from "pixi.js";
import { extend } from '@pixi/react';
extend({
    Sprite,
    Container,
    Texture,
    Assets,
});

export default function Reels({ slotImages, colsIndex }) {
    return (
        <pixiContainer position={{ x: 100, y: 50 }}>
            {
                Object.values(slotImages).map((el, i) => {
                    return (
                        <pixiSprite
                            key={i}
                            texture={el}
                            position={{ x: colsIndex * 150, y: i * 150 }}
                        />
                    )


                })
            }

        </pixiContainer>

    )
}