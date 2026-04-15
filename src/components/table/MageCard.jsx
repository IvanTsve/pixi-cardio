import { Sprite, Container, Texture, Assets } from "pixi.js";
import { extend, useTick } from "@pixi/react";
import cardImage from "../../assets/Mage/mage.png";

import { useRef, useState, useEffect } from "react";
extend({
  Sprite,
  Container,
});
const SPEED = 5;
const keyActions = {
  w: { dx: 0, dy: -SPEED },
  s: { dx: 0, dy: SPEED },
  a: { dx: -SPEED, dy: 0 },
  d: { dx: SPEED, dy: 0 },
};
const runFramePaths = Object.values(
  import.meta.glob("../../assets/Mage/Run/*.png", {
    eager: true,
    import: "default",
  }),
);
const FRAME_DURATION = 8;

export function MageCard() {
  const frameIndex = useRef(0);
  const elapsed = useRef(0);
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [runTextures, setRunTextures] = useState([]);
  const keysPressed = useRef(new Set());

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(cardImage).then((result) => setTexture(result));
    }
  }, [texture]);
  useEffect(() => {
    Promise.all(runFramePaths.map((path) => Assets.load(path))).then(
      (textures) => {
        setRunTextures(textures);
      },
    );

    const onDown = (e) => keysPressed.current.add(e.key.toLowerCase());
    const onUp = (e) => keysPressed.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useTick((ticker) => {
    if (!spriteRef.current) return;
    let isMoving = false;
    for (const key of keysPressed.current) {
      const action = keyActions[key];
      if (action) {
        spriteRef.current.x += action.dx * ticker.deltaTime;
        spriteRef.current.y += action.dy * ticker.deltaTime;
        isMoving = true;
      }
    }

    if (isMoving && runTextures.length > 0) {
      elapsed.current += ticker.deltaTime;
      if (elapsed.current >= FRAME_DURATION) {
        elapsed.current = 0;
        frameIndex.current = (frameIndex.current + 1) % runTextures.length;
      }
      spriteRef.current.texture = runTextures[frameIndex.current];
    } else {
      elapsed.current = 0;
      frameIndex.current = 0;
      spriteRef.current.texture = texture;
    }
  });

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      eventMode={"static"}
      texture={texture}
      x={150}
      y={150}
    />
  );
}
