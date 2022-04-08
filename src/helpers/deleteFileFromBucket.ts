import { Storage } from '@google-cloud/storage';
import { HttpStatus } from '@nestjs/common';

export default async function deleteFileFromBucket(
  bucketName: string,
  imageName: string,
  res: any,
) {
  try {
    const storage = new Storage();

    await storage.bucket(bucketName).file(imageName).delete();
    // console.log(`image ${imageName} deleted successfully`);
  } catch (error) {
    console.log(
      `https://storage.googleapis.com/${bucketName}/${imageName} was not deleted. Error ${error}`,
    );
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: `https://storage.googleapis.com/${bucketName}/${imageName} was not deleted. Error ${error.message}`,
    });
  }

  console.log(
    `https://storage.googleapis.com/${bucketName}/${imageName} deleted successfully`,
  );
  // return res.status(HttpStatus.OK).json({
  //   message: `https://storage.googleapis.com/${bucketName}/${imageName} deleted successfully`,
  // });
}
