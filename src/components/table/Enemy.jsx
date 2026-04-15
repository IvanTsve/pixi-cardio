import { extend, useTick } from "@pixi/react";
import { Graphics, Sprite, Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
extend({
  Graphics,
  Sprite,
});
const SPEED = 1;
const keyActions = {
  w: { dx: 0, dy: -SPEED },
  s: { dx: 0, dy: SPEED },
  a: { dx: -SPEED, dy: 0 },
  d: { dx: SPEED, dy: 0 },
};
const walkFramePaths = Object.values(
  import.meta.glob("../../assets/Rogue/Walk/*.png", {
    eager: true,
    import: "default",
  }),
);
const FRAME_DURATION = 8;
const DIRECTION_CHANGE_INTERVAL = 120;
const DIRECTIONS = ["a", "s", "d", "w"];

export function Enemy() {
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [walkTextures, setWalkTextures] = useState([]);

  const frameIndex = useRef(0);
  const elapsed = useRef(0);

  const directionElapsed = useRef(0);
  const currentDirection = useRef("d");

  useTick((ticker) => {
    if (!spriteRef.current || walkTextures.length === 0) return;

    directionElapsed.current += ticker.deltaTime;
    if (directionElapsed.current >= DIRECTION_CHANGE_INTERVAL) {
      directionElapsed.current = 0;
      currentDirection.current =
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    }

    const action = keyActions[currentDirection.current];
    if (currentDirection.current == 'a') {
        spriteRef.current.scale.x = -1;
      } else {
        spriteRef.current.scale.x = 1;
      }
    if (action) {
      spriteRef.current.x += action.dx * ticker.deltaTime;
      spriteRef.current.y += action.dy * ticker.deltaTime;
    }
    // Clamping
    const halfW = spriteRef.current.width / 2;
    const halfH = spriteRef.current.height / 2;
    spriteRef.current.x = Math.max(
      halfW,
      Math.min(800 - halfW, spriteRef.current.x),
    );
    spriteRef.current.y = Math.max(
      halfH,
      Math.min(600 - halfH, spriteRef.current.y),
    );
    elapsed.current += ticker.deltaTime;
    if (elapsed.current >= FRAME_DURATION) {
      elapsed.current = 0;
      frameIndex.current = (frameIndex.current + 1) % walkTextures.length;
    }
    spriteRef.current.texture = walkTextures[frameIndex.current];
  });

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("//src/assets/Rogue/walk/walk1.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  useEffect(() => {
    Promise.all(walkFramePaths.map((path) => Assets.load(path))).then(
      (textures) => {
        setWalkTextures(textures);
      },
    );
  }, []);
  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      eventMode={"static"}
      texture={texture}
      x={100}
      y={100}
    />
  );
}
