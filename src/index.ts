export interface PdfInfoFields {
  readonly title?: string;
  readonly author?: string;
  readonly subject?: string;
  readonly keywords?: string;
  readonly creator?: string;
  readonly producer?: string;
  readonly creationDate?: string;
  readonly modificationDate?: string;
}

export class PdfMetadataEditorError extends Error {
  constructor(
    readonly code: 'invalid' | 'limit',
    message: string,
  ) {
    super(message);
    this.name = 'PdfMetadataEditorError';
  }
}

const allowedFields = new Set<keyof PdfInfoFields>([
  'title',
  'author',
  'subject',
  'keywords',
  'creator',
  'producer',
  'creationDate',
  'modificationDate',
]);

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export class PdfMetadataEditor {
  private fields: Partial<Record<keyof PdfInfoFields, string>> = {};
  constructor(
    readonly maxFields = 32,
    readonly maxValueLength = 4000,
  ) {
    if (
      !Number.isSafeInteger(maxFields) ||
      maxFields < 1 ||
      !Number.isSafeInteger(maxValueLength) ||
      maxValueLength < 1
    ) {
      throw new PdfMetadataEditorError(
        'invalid',
        'Metadata limits must be positive safe integers.',
      );
    }
  }

  set(fields: PdfInfoFields): Readonly<Partial<Record<keyof PdfInfoFields, string>>> {
    const next = { ...this.fields };
    for (const [key, value] of Object.entries(fields)) {
      if (!allowedFields.has(key as keyof PdfInfoFields))
        throw new PdfMetadataEditorError('invalid', `Unsupported Info field ${key}.`);
      if (
        value !== undefined &&
        (typeof value !== 'string' || value.length > this.maxValueLength)
      ) {
        throw new PdfMetadataEditorError(
          'limit',
          `${key} must be a string within the configured limit.`,
        );
      }
      if (value === undefined) delete next[key as keyof PdfInfoFields];
      else next[key as keyof PdfInfoFields] = value;
    }
    if (Object.keys(next).length > this.maxFields)
      throw new PdfMetadataEditorError('limit', 'Metadata field count limit reached.');
    this.fields = next;
    return this.snapshot();
  }

  remove(...keys: readonly (keyof PdfInfoFields)[]): void {
    for (const key of keys) delete this.fields[key];
  }

  snapshot(): Readonly<Partial<Record<keyof PdfInfoFields, string>>> {
    return Object.freeze({ ...this.fields });
  }

  toXmpDescription(): string {
    const properties = Object.entries(this.fields)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `<lp:${key}>${escapeXml(value!)}</lp:${key}>`)
      .join('');
    return `<?xpacket begin="﻿"?>\n<x:xmpmeta xmlns:x="adobe:ns:meta"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:lp="https://lp-labs.example/pdf-info/">${properties}</rdf:Description></rdf:RDF></x:xmpmeta>\n<?xpacket end="w"?>`;
  }
}

export function createPdfMetadataEditor(
  maxFields?: number,
  maxValueLength?: number,
): PdfMetadataEditor {
  return new PdfMetadataEditor(maxFields, maxValueLength);
}
