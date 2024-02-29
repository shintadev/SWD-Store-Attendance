import EnvVars from '@src/constants/EnvVars';
import {
  RekognitionClient,
  IndexFacesCommand,
  QualityFilter,
  SearchFacesByImageCommand,
} from '@aws-sdk/client-rekognition';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

// **** Class **** //

class ImageService {
  private client;
  private collectionId;

  public constructor() {
    this.client = new RekognitionClient({
      region: EnvVars.Rekognition.REGION,
    });
    this.collectionId = EnvVars.Rekognition.COLLECTION_ID;
  }

  // **** Functions **** //

  public async indexFace(image: string, collectionId?: string) {
    const params = {
      CollectionId: collectionId ?? this.collectionId,
      Image: {
        Bytes: Buffer.from(image, 'base64'), // Encode image data as base64
      },
      MaxFaces: 1,
      QualityFilter: QualityFilter.MEDIUM,
    };

    try {
      const command = new IndexFacesCommand(params);
      const faces = await this.client.send(command);

      // Prepare response
      const FaceRecords = faces.FaceRecords ?? undefined;
      if (!FaceRecords)
        throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Can not detect any face');
      const face = FaceRecords[0].Face ?? undefined;
      if (!face) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Face info not found');

      return face;
    } catch (error) {
      console.log('🚀 ~ ImageService ~ detectFace ~ error:', error);

      throw error;
    }
  }

  public async searchFace(image: string) {
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
      const faces = await this.client.send(command);

      // Prepare response
      const faceMatch = faces.FaceMatches ?? undefined;
      if (!faceMatch) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Can not detect any face');
      const face = faceMatch[0].Face ?? undefined;
      if (!face) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Face info not found');

      const result = { ...face, similarity: faceMatch[0].Similarity };
      return result;
    } catch (error) {
      console.log('🚀 ~ ImageService ~ searchFace ~ error:', error);

      throw error;
    }
  }
}

export default new ImageService();
