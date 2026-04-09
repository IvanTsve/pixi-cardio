import SlotSymbol from './SlotSymbol';
import { extend, useTick } from '@pixi/react';
import { Graphics, UPDATE_PRIORITY } from 'pixi.js';
import { useRef, useEffect } from 'react';
extend({
    Graphics,
});
const SYMBOL_H = 90;
const VISIBLE_SYMBOLS = 3;
const BUFFER_SYMBOLS = 1;
const TOTAL_ROWS = VISIBLE_SYMBOLS + BUFFER_SYMBOLS;


export default function SlotReel({ textures, posX, spinning }) {
    const symbolsRef = useRef(null);
    const maskRef = useRef(null);
    const offsetRef = useRef(0);


    useEffect(() => {
        if (symbolsRef.current && maskRef.current) {
            symbolsRef.current.mask = maskRef.current;
        }
        return () => {
            if (symbolsRef.current && maskRef.current) {
                symbolsRef.current.mask = null;
            }
        }
    }, []);

    const randomTexture = () => textures[Math.floor(Math.random() * textures.length)];

    useTick({
        callback() {
            if (!symbolsRef.current) return;
            const speed = 9;
            offsetRef.current += speed;
            symbolsRef.current.y = offsetRef.current;

            while (offsetRef.current > SYMBOL_H) {
                offsetRef.current -= SYMBOL_H;
                symbolsRef.current.y = offsetRef.current;

                const children = symbolsRef.current.children;
                if (children.length > 0) {
                    const first = children[0];
                    symbolsRef.current.removeChild(first);
                    symbolsRef.current.addChild(first);

                    first.texture = randomTexture();
                    symbolsRef.current.children.forEach((child, idx) => {
                        child.y = idx * SYMBOL_H;
                    });
                }
            }


        },
        isEnabled: spinning,
        priority: UPDATE_PRIORITY.HIGH,
    });

    return (
        <>
            <pixiGraphics
                position={{ x: posX, y: 0 }}
                draw={(g) => {
                    g.clear();
                    g.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 1 });
                    g.rect(-35, -35, 70, 250);
                    g.stroke();
                }}
            />
            <pixiGraphics
                ref={maskRef}
                position={{ x: posX, y: 0 }}
                draw={(g) => {
                    g.clear();
                    g.rect(-35, -35, 70, 250);
                    g.fill({ color: 0xffffff, alpha: 1 });
                }}
            />
            <pixiContainer ref={symbolsRef} osition={{ x: posX, y: 0 }}  >
                {Array.from({ length: TOTAL_ROWS }).map((_, index) => (
                    <SlotSymbol
                        key={index}
                        position={{ x: posX, y: index * SYMBOL_H }}
                        texture={textures[index % Math.max(textures.length, 1)]}
                    />
                ))}
            </pixiContainer>

        </>
    );
}