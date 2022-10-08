import { Sprite } from 'src/sprite';

export const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise(e => {
    const img = new Image();
    img.src = url;
    img.onload = () => e(img);
  });
export const loadResources = async (): Promise<Sprite[]> =>
  (await Promise.all([loadImage('./img/tst.png'), loadImage('./img/overworld_front.png')])).map(img => new Sprite(img));
