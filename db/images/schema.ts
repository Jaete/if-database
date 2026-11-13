import { Schema } from 'mongoose';
import type IImage from './image.d';

// Imagens nunca mudam: um novo envio é um novo id. Por isso não há updatedAt.
const ImageSchema = new Schema<IImage>({
  // Fora de qualquer consulta que não peça `+data`: são centenas de KB por
  // documento e nenhuma listagem precisa deles.
  data: { type: Buffer, required: true, select: false },
  contentType: { type: String, required: true, default: 'image/webp' },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  bytes: { type: Number, required: true },
  uploadedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default ImageSchema;
