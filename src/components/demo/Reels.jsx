import { Application, Sprite, Container, Texture, Assets } from "pixi.js";
import { extend } from '@pixi/react';
extend({
    Sprite,
    Container,
    Texture,
    Assets,
});

export default function Reels({ slotImages }) {
    return (
        <pixiContainer position={{ x: 300, y: 100 }}>
            {
                Array.from({ length: 4 }).map((_, i) => {
                    return (
                        <pixiGraphics
                            key={i}
                            position={{ x: i * 150, y: 0 }}
                            draw={(g) => {
                                g.clear();
                                g.rect(-150, -35, 120, 400);
                                g.stroke({ color: 0xffffff, alpha: 1 });
                            }}
                        />
                    )


                })
            }

        </pixiContainer>

    )
}