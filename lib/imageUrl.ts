/**
 * URLs de imagem enviadas pelo app. Gravamos o caminho relativo, e não uma URL
 * absoluta: o mesmo banco serve o localhost e a produção, e um
 * `https://localhost:3000/...` salvo no dev quebraria no ar.
 */
const UPLOADED_IMAGE = /^\/api\/images\/[0-9a-f]{24}$/i;
const HTTP_IMAGE = /^https?:\/\//i;

export const IMAGE_ID = /^[0-9a-f]{24}$/i;

export const isUploadedImageUrl = (value: string) => UPLOADED_IMAGE.test(value);

/** Link externo http(s) ou imagem enviada ao app. Nada de `javascript:`/`data:`. */
export const isImageUrl = (value: string) =>
  HTTP_IMAGE.test(value) || UPLOADED_IMAGE.test(value);

/** Torna absoluta uma imagem enviada, para quem vive fora da origem do app. */
export const absoluteImageUrl = (value: string, base: string) =>
  UPLOADED_IMAGE.test(value) ? `${base}${value}` : value;

/** O id de uma imagem enviada, ou null para qualquer outra URL. */
export const uploadedImageId = (value?: string | null) =>
  value && UPLOADED_IMAGE.test(value)
    ? value.slice('/api/images/'.length)
    : null;
