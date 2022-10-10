function createCanvas(width: number, height: number): HTMLCanvasElement {
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  return buffer;
}

export function createRenderContext(width: number, height: number): CanvasRenderingContext2D {
  const canvas = createCanvas(width, height) as any;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;
  return context;
}
