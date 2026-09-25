import { useRef, useEffect } from 'react';
import { useKaleidoscope } from './hooks/useKaleidoscope';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { drawSegment } = useKaleidoscope(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let drawing = false;
    let lastPoint = { x: 0, y: 0 };

    function getPoint(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (canvas!.width / rect.width),
        y: (e.clientY - rect.top) * (canvas!.height / rect.height),
      };
    }

    function handleDown(e: PointerEvent) {
      drawing = true;
      lastPoint = getPoint(e);
    }

    function handleMove(e: PointerEvent) {
      if (!drawing) return;
      const point = getPoint(e);
      drawSegment(lastPoint, point, 'white', 3, 8, true);
      lastPoint = point;
    }

    function handleUp() {
      drawing = false;
    }

    canvas.addEventListener('pointerdown', handleDown);
    canvas.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      canvas.removeEventListener('pointerdown', handleDown);
      canvas.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [drawSegment]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={480}
      style={{ background: 'black', cursor: 'crosshair' }}
    />
  );
}

export default App;