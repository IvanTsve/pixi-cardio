import { Sprite, Container } from "pixi.js";
import { extend } from '@pixi/react';
import { useRef, useEffect } from 'react';
extend({
    Sprite,
    Container,
});

export default function Reels({ slotImages, colsIndex, SYMBOL_H, SYMBOL_W, VISIBLE_ROWS }) {
    const symbolsRef = useRef(null);
    const maskRef = useRef(null);

    useEffect(() => {
        if (symbolsRef.current && maskRef.current) {
            symbolsRef.current.mask = maskRef.current;
        }
    }, []);
    return (
        <pixiContainer position={{ x: 100, y: 50 }}>
            <pixiGraphics ref={maskRef} key={'mask-' + colsIndex}
                position={{ x: colsIndex * 150, y: 0 }}
                draw={(g) => {
                    g.clear();
                    g.rect(0, 0, SYMBOL_W, (SYMBOL_H + 20) * VISIBLE_ROWS);
                    g.fill({ color: 0xffffff, alpha: 0.5 });
                }}
            />
            <pixiContainer ref={symbolsRef} position={{ x: 0, y: 0 }}>

                {Object.values(slotImages).map((el, i) => {
                    return (
                        <pixiSprite
                            key={i}
                            height={SYMBOL_H}
                            width={SYMBOL_W}
                            texture={el}
                            position={{ x: colsIndex * 150, y: i * 150 }}
                        />
                    )


                })}
            </pixiContainer>

        </pixiContainer>

    )
}