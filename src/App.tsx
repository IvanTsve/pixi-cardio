import { Application, extend } from '@pixi/react';
import { Container, Assets, Text } from 'pixi.js';
import SlotReel from './components/SlotReel.jsx';
import { useState, useEffect } from 'react';

import one from './assets/1.png';
import two from './assets/2.png';
import three from './assets/3.png';
import four from './assets/4.png';
import five from './assets/5.png';
import six from './assets/6.png';

extend({
  Container,
  Text,
});

export default function App() {
  const [textures, setTextures] = useState([]);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    Assets.load([one, two, three, four, five, six]).then((textures) => {
      setTextures([Object.values(textures)[0], Object.values(textures)[1], Object.values(textures)[2], Object.values(textures)[3], Object.values(textures)[4], Object.values(textures)[5]]);
    });

  }, []);
  function handleSpinClick() {
    if (spinning) {
      return;
    }
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 5000);
  }
  return (
    <Application width={800} height={600} defaultTextStyle={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
      <pixiContainer
        position={{ x: 300, y: 100 }}
        scale={1.5}
      >
        {
          Array.from({ length: 1 }).map((_, index) => (
            <SlotReel key={index} textures={textures} posX={150 * index} spinning={spinning} />
          ))
        }
      </pixiContainer>
      <pixiText
        text="Spin"
        position={{ x: 300, y: 500 }}
        eventMode="static"
        cursor="pointer"
        style={{ fontSize: 24, fontWeight: 'bold', fill: '#fff' }}
        onClick={handleSpinClick}
      />
    </Application>
  );
}