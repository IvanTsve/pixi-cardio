import { Sprite, Container } from "pixi.js";
import { extend, useTick } from '@pixi/react';
import { useRef, useEffect, useState } from 'react';
extend({
    Sprite,
    Container,
});
const SYMBOL_H = 128;
const SYMBOL_W = 128;
const SPEED = 9;
const GAP = 20;
const STEP_Y = SYMBOL_H + GAP;
const SYMBOL_STEP = SYMBOL_H + GAP;

export default function Reels({ slotImages, colsIndex, isSpinning, VISIBLE_ROWS }) {
    const symbolsRef = useRef(null);
    const maskRef = useRef(null);
    const offsetRef = useRef(0);
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        if (symbolsRef.current && maskRef.current) {
            symbolsRef.current.mask = maskRef.current;
        }
    }, []);

    useEffect(() => {
        setSymbols(slotImages);
    }, [slotImages]);

    useTick({
        callback() {

            if (isSpinning) {
                offsetRef.current += SPEED;
                symbolsRef.current.y = offsetRef.current;

                while (offsetRef.current > STEP_Y) {
                    offsetRef.current -= STEP_Y;
                    symbolsRef.current.y = offsetRef.current;

                    const children = symbolsRef.current.children;

                    if (!children.length) return;

                    setSymbols((prev) => {
                        if (!prev.length) return prev;
                        const [first, ...rest] = prev;
                        const randomTexture =
                            slotImages[Math.floor(Math.random() * slotImages.length)]?.texture ?? first.texture;
                        return [
                            ...rest,
                            {
                                ...first,
                                texture: randomTexture,
                            },
                        ];
                    });
                }

            }
        },
        isEnabled: isSpinning,
    })


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

                {symbols.map((el, i) => {
                    return (
                        <pixiSprite
                            key={el.id}
                            height={SYMBOL_H}
                            width={SYMBOL_W}
                            texture={el.texture}
                            position={{ x: colsIndex * 150, y: i * SYMBOL_STEP }}
                        />
                    )


                })}
            </pixiContainer>

        </pixiContainer>

    )
}