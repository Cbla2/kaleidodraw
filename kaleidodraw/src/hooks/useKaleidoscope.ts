import { useRef, useCallback } from 'react';

export function useKaleidoscope(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const getCenter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { cx: 0, cy: 0 };
    return { cx: canvas.width / 2, cy: canvas.height / 2 };
  }, [canvasRef]);

  const drawSegment = useCallback(
    (p0: { x: number; y: number }, p1: { x: number; y: number }, color: string, size: number, segments: number, mirror: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { cx, cy } = getCenter();

      const dx0 = p0.x - cx, dy0 = p0.y - cy;
      const dx1 = p1.x - cx, dy1 = p1.y - cy;
      const angleStep = (Math.PI * 2) / segments;

      ctx.lineCap = 'round';
      ctx.lineWidth = size;
      ctx.strokeStyle = color;

      for (let k = 0; k < segments; k++) {
        const angle = k * angleStep;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(dx0, dy0);
        ctx.lineTo(dx1, dy1);
        ctx.stroke();
        ctx.restore();

        if (mirror) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.scale(1, -1);
          ctx.beginPath();
          ctx.moveTo(dx0, dy0);
          ctx.lineTo(dx1, dy1);
          ctx.stroke();
          ctx.restore();
        }
      }
    },
    [canvasRef, getCenter]
  );

  return { getCenter, drawSegment };
}