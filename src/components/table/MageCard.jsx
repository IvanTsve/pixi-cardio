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
  w: { dx: 0, dy: -SPEED, scaleX: 1 },
  s: { dx: 0, dy: SPEED, scaleX: 1 },
  a: { dx: -SPEED, dy: 0, scaleX: -1 },
  d: { dx: SPEED, dy: 0, scaleX: 1 },
};
const AttackKeyActions = {
  f: { dx: SPEED, dy: 0, scaleX: 1 },
};
const runFramePaths = Object.values(
  import.meta.glob("../../assets/Mage/Run/*.png", {
    eager: true,
    import: "default",
  }),
);
const attackFramePaths = Object.values(
  import.meta.glob("../../assets/Mage/Attack/*.png", {
    eager: true,
    import: "default",
  }),
);
const fireBallFramePaths = Object.values(
  import.meta.glob("../../assets/Mage/Fire/*.png", {
    eager: true,
    import: "default",
  }),
);
const FRAME_DURATION = 8;

export function MageCard({ TILE_SIZE,ROOM_MAP }) {
  const frameIndex = useRef(0);
  const elapsed = useRef(0);
  const spriteRef = useRef(null);
  const fireBallSpriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [runTextures, setRunTextures] = useState([]);
  const [fireBallTextures, setFireBallTextures] = useState([]);
  const [attackTextures, setAttackTextures] = useState([]);

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
    Promise.all(attackFramePaths.map((path) => Assets.load(path))).then(
      (textures) => {
        setAttackTextures(textures);
      },
    );
    Promise.all(fireBallFramePaths.map((path) => Assets.load(path))).then(
      (textures) => {
        setFireBallTextures(textures);
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
  function isWall(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    if (row < 0 || row >= ROOM_MAP.length || col < 0 || col >= ROOM_MAP[0].length) {
      return true;
    }
    return ROOM_MAP[row][col] === 1;
  }
  useTick((ticker) => {
    if (!spriteRef.current) return;
    let isMoving = false;
    let isAttacking = false;
    if (!isAttacking && fireBallSpriteRef.current) {
      fireBallSpriteRef.current.visible = false;
    }
    
    for (const key of keysPressed.current) {
      const action = keyActions[key];
      const attackAction = AttackKeyActions[key];

      if (action) {
        const nextX = spriteRef.current.x + action.dx * ticker.deltaTime;
  const nextY = spriteRef.current.y + action.dy * ticker.deltaTime;
  if (!isWall(nextX, spriteRef.current.y)) {
    spriteRef.current.x = nextX;
  }
  if (!isWall(spriteRef.current.x, nextY)) {
    spriteRef.current.y = nextY;
  }
        spriteRef.current.scale.x = action.scaleX
          ? action.scaleX
          : spriteRef.current.scale.x;
        isMoving = true;
      }
      if (attackAction) {
        isAttacking = true;
        fireBallSpriteRef.current.visible = true;
        fireBallSpriteRef.current.texture = fireBallTextures[frameIndex.current] ? fireBallTextures[frameIndex.current] : fireBallTextures[0];
        fireBallSpriteRef.current.x = spriteRef.current.x + 50;
        fireBallSpriteRef.current.y = spriteRef.current.y + 10;
      }



    }

    if ((isMoving || isAttacking === true) && (runTextures.length > 0 || attackTextures.length > 0)) {
      elapsed.current += ticker.deltaTime;
      if (elapsed.current >= FRAME_DURATION) {
        elapsed.current = 0;
        frameIndex.current =(frameIndex.current + 1) % (isAttacking === true ? attackTextures.length : runTextures.length);
      }
      spriteRef.current.texture = isAttacking === true ? attackTextures[frameIndex.current] : runTextures[frameIndex.current];
    } else {
      elapsed.current = 0;
      frameIndex.current = 0;
      spriteRef.current.texture = texture;
    }
  });

  return (
    <>
      <pixiSprite
        ref={spriteRef}
        anchor={0.5}
        eventMode={"static"}
        texture={texture}
        x={150}
        y={150}
      />
          <pixiSprite
            visible={false}
            ref={fireBallSpriteRef}
            anchor={0.5}
            eventMode={"static"}
            texture={fireBallTextures[0]}
            x={spriteRef.current ? spriteRef.current.x + 50 : 0}
            y={spriteRef.current ? spriteRef.current.y + 10 : 0}
            scale={1.5}
          />
    </>
  );
}
