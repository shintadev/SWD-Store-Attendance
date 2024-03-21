import EnvVars from '../constants/EnvVars';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

// **** Class **** //

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

    Cloudinary.config(this.config);
  }

  // **** Functions **** //

  public async uploadToCloud(image: Buffer) {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        Cloudinary.uploader
          .upload_stream((error, result) => {
            if (result) return resolve(result);
            else reject(error);
          })
          .end(image);
      });

      return result.public_id;
    } catch (error) {
      console.log('🚀 ~ FileService ~ uploadToCloud ~ error:', error);

      throw error;
    }
  }

  public async getUrlFromCloud(publicId: string) {
    try {
      // Retrieve image URL using stored public ID
      const imageUrl = await new Promise<string>((resolve) =>
        resolve(Cloudinary.url(publicId, this.config))
      );
      return imageUrl;
    } catch (error) {
      console.log('🚀 ~ FileService ~ getUrlFromCloud ~ error:', error);

      throw error;
    }
  }
}
export default new FileService();
