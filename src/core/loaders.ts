export const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise(e => {
    const img = new Image();
    img.src = url;
    img.onload = () => e(img);
  });
