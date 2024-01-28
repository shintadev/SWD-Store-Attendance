import EnvVars from '@src/constants/EnvVars';
import {
  RekognitionClient,
  IndexFacesCommand,
  IndexFacesCommandOutput,
  QualityFilter,
  SearchFacesByImageCommand,
  SearchFacesByImageCommandOutput,
} from '@aws-sdk/client-rekognition';

class ImageService {
  private client;
  private collectionId;

  public constructor() {
    this.client = new RekognitionClient({
      region: EnvVars.Rekognition.REGION,
    });
    this.collectionId = EnvVars.Rekognition.COLLECTION_ID;
    console.log('🚀 ~ ImageService ~ constructor ~ collectionId:', this.collectionId);
  }

  public async indexFace(image: string): Promise<IndexFacesCommandOutput> {
    const params = {
      CollectionId: this.collectionId,
      Image: {
        Bytes: Buffer.from(image, 'base64'), // Encode image data as base64
      },
      MaxFaces: 1,
      QualityFilter: QualityFilter.MEDIUM,
    };

    try {
      const command = new IndexFacesCommand(params);
      return await this.client.send(command);
    } catch (error) {
      console.log('🚀 ~ ImageService ~ detectFace ~ error:', error);

      throw error;
    }
  }

  public async searchFace(image: string): Promise<SearchFacesByImageCommandOutput> {
    const params = {
      CollectionId: this.collectionId,
      Image: {
        Bytes: Buffer.from(image, 'base64'), // Encode image data as base64
      },
      MaxFaces: 1,
      QualityFilter: QualityFilter.MEDIUM,
      FaceMatchThreshold: 90,
    };

    try {
      const command = new SearchFacesByImageCommand(params);
      return await this.client.send(command);
    } catch (error) {
      console.log('🚀 ~ ImageService ~ compareFace ~ error:', error);

      throw error;
    }
  }
}

export default new ImageService();
