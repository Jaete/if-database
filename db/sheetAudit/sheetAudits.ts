import { model, models, type Model } from 'mongoose';
import type { ISheetAudit } from './sheetAudit';
import { SheetAuditSchema } from './schema';

const SheetAudit: Model<ISheetAudit> =
  (models.SheetAudit as Model<ISheetAudit>) ||
  model<ISheetAudit>('SheetAudit', SheetAuditSchema);

export default SheetAudit;
