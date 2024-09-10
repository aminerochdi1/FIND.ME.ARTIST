import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default async function handler(req: any, res: any) {
  const { width, height } = req.query;

  const originalName = req.query.name;
  const originalNameSplited = originalName.split(".");

  const isThumbnail = (width != undefined && height != undefined);

  const imagePath = path.join(process.cwd(), '/public/uploads/', originalName);

  if (isThumbnail) {
    const thumbnailName = originalNameSplited[0] + "-" + width + "x" + height+"."+originalNameSplited[1];
    
    const thumbnailPath = path.join(process.cwd(), '/public/uploads/thumbnails/', thumbnailName);
    if (fs.existsSync(thumbnailPath)) {
      const imageStream = fs.createReadStream(thumbnailPath);

      res.setHeader('Content-Type', 'image/jpeg');

      imageStream.pipe(res);
      return;
    } else if (fs.existsSync(imagePath)) {
      const directoryPath = path.join(process.cwd(), '/public/uploads/thumbnails/');
      
      if (!fs.existsSync(directoryPath)) {
        await fs.mkdirSync(directoryPath);
      }

      const imageBuffer = await sharp(imagePath)
        .resize(Number.parseInt(width), Number.parseInt(height))
        .toBuffer();

      await sharp(imageBuffer)
        .toFile(thumbnailPath);

      const imageStream = fs.createReadStream(thumbnailPath);

      res.setHeader('Content-Type', 'image/jpeg');

      imageStream.pipe(res);
      return;
    }
  } else {
    if (fs.existsSync(imagePath)) {
      const imageStream = fs.createReadStream(imagePath);

      res.setHeader('Content-Type', 'image/jpeg');

      imageStream.pipe(res);
      return;
    }
    res.status(404).send('Image not found');
  }
}
