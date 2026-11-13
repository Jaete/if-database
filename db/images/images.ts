import { models, model } from 'mongoose';
import type IImage from './image.d';
import ImageSchema from './schema';

const ImageModel = models.Image || model<IImage>('Image', ImageSchema);

export default ImageModel;
