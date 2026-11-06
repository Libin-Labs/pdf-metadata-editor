import { createPdfMetadataEditor } from '@lp-labs/pdf-metadata-editor';

const xml: string = createPdfMetadataEditor().toXmpDescription();
void xml;
