import { createPdfMetadataEditor, type PdfInfoFields } from '@lp-labs/pdf-metadata-editor';

const fields: PdfInfoFields = {
  title: 'Report',
  creationDate: 'D:20260101000000Z',
};
const snapshot: Readonly<Partial<Record<keyof PdfInfoFields, string>>> =
  createPdfMetadataEditor().set(fields);
void snapshot;
