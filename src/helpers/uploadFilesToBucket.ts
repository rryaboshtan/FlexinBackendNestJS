import * as fs from 'fs';
import * as uuid from 'uuid';
import { Storage } from '@google-cloud/storage';
import { UnitImageService } from 'src/services/UnitImage.service';

export default function uploadFilesToBucket(
  files: any,
  bucketName: string,
  body: any,
    unitImageService: UnitImageService,
  owner: boolean,
) {
  const storage = new Storage();

  files.forEach((file: any) => {
    const filename = uuid.v4() + '.jpg';

    fs.writeFile(filename, file.buffer, async (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');

      const publicImageUrl: string | void = await uploadFile(
        bucketName,
        filename,
      ).catch(console.error);

      unitImageService.create({
        image: publicImageUrl,
        unit_id: owner? body.owner : body.unit,
        is_primary: false,
      });
    });
  });

  async function uploadFile(
    bucketName: string,
    filename: string,
  ): Promise<string> {
    await storage.bucket(bucketName).upload(filename, {
      destination: filename,
    });
    console.log(`${filename} uploaded to ${bucketName}`);

    fs.unlink(filename, (err) => {
      if (err) return console.log(err);
      console.log('file deleted successfully');
    });

    return `https://storage.googleapis.com/${bucketName}/${filename}`;
  }
}
