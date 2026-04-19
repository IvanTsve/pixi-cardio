import { Sprite, Container } from "pixi.js";
import { extend, useTick } from '@pixi/react';
import { useRef, useEffect } from 'react';
extend({
    Sprite,
    Container,
});
const SYMBOL_H = 128;
const SYMBOL_W = 128;
const SPEED = 9;
const GAP = 20;
const VISIBLE_ROWS = 5;
const STEP_Y = SYMBOL_H + GAP;
const SYMBOL_STEP = SYMBOL_H + GAP;

export default function Reels({ slotImages, colsIndex, isSpinning, VISIBLE_ROWS }) {
    const symbolsRef = useRef(null);
    const maskRef = useRef(null);
    const offsetRef = useRef(0);

    useEffect(() => {
        if (symbolsRef.current && maskRef.current) {
            symbolsRef.current.mask = maskRef.current;
        }
    }, []);

    useTick({
        callback() {
            console.log(isSpinning);

            if (isSpinning) {
                offsetRef.current += SPEED;
                symbolsRef.current.y = offsetRef.current;

                while (offsetRef.current > STEP_Y) {
                    offsetRef.current -= STEP_Y;
                    symbolsRef.current.y = offsetRef.current;

                    const children = symbolsRef.current.children;

                    if (!children.length) return;

                    const first = children[0];
                    symbolsRef.current.removeChild(first);
                    symbolsRef.current.addChild(first);



                    // first.texture = slotImages[Math.floor(Math.random() * slotImages.length)];

                    symbolsRef.current.children.forEach((child, i) => {
                        child.y = i * SYMBOL_STEP;
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

                {Object.values(slotImages).map((el, i) => {
                    return (
                        <pixiSprite
                            key={i}
                            height={SYMBOL_H}
                            width={SYMBOL_W}
                            texture={el}
                            position={{ x: colsIndex * 150, y: i * SYMBOL_STEP }}
                        />
                    )


                })}
            </pixiContainer>

        </pixiContainer>

    )
}