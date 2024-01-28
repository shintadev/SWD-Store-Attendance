import EnvVars from '@src/constants/EnvVars';
import { v2 as Cloudinary } from 'cloudinary';

class FileService {
  private config;
  private cloudName = EnvVars.Cloudinary.NAME;
  private apiKey = EnvVars.Cloudinary.API_KEY;
  private apiSecret = EnvVars.Cloudinary.API_SECRET;

  public constructor() {
    this.config = {
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      secure: true,
    };

    console.log('🚀 ~ FileService ~ constructor ~ config:', this.config);

    Cloudinary.config(this.config);
  }

  public async uploadToCloud(image: string): Promise<string> {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await Cloudinary.uploader.upload(image, options); //Not working

      return result.public_id;
    } catch (error) {
      console.log('🚀 ~ FileService ~ uploadToCloud ~ error:');

      throw error;
    }
  }

  public async getUrlFromCloud(publicId: string): Promise<string> {
    try {
      // Retrieve image URL using stored public ID
      const imageUrl = await new Promise<string>((resolve) =>
        resolve(Cloudinary.url(publicId, this.config))
      );
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export default new FileService();
