import { Application } from '@pixi/react';
import { useRef } from 'react';

function App() {
  const parentRef = useRef(null);
  return(
  <div ref={parentRef} style={{ width: '100%', height: '100%' }}>
    <Application resizeTo={parentRef} />
  </div>
  )
}

export default App
