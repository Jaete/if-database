export default interface IImage {
  /** O WebP já processado; nunca vai para listagens (`select: false`). */
  data: Buffer;
  contentType: 'image/webp';
  width: number;
  height: number;
  bytes: number;
  uploadedBy: string;
  createdAt: Date;
}
