# @lp-labs/pdf-metadata-editor

A bounded model for standard document Info values that can produce an XML-escaped, deterministic
metadata description for a caller-owned PDF adapter.

## Install and quick start

```sh
npm install @lp-labs/pdf-metadata-editor
```

```js
import { createPdfMetadataEditor } from '@lp-labs/pdf-metadata-editor';

const metadata = createPdfMetadataEditor();
metadata.set({
  title: 'Quarterly report',
  author: 'A. Reader',
  keywords: 'finance, review',
});
console.log(metadata.toXmpDescription());
```

## API, types, and customization

- `PdfInfoFields` lists the supported title, author, subject, keywords, creator, producer, creation
  date, and modification date strings. `createPdfMetadataEditor(maxFields?, maxValueLength?)`
  returns `PdfMetadataEditor` (defaults: 32 fields and 4,000 UTF-16 code units per value).
- `set(fields)` validates the patch and returns a frozen model; `remove(...keys)` clears values;
  `snapshot()` returns the Info-field model; `toXmpDescription()` emits sorted properties with XML
  escaping. `PdfMetadataEditorError` uses `invalid` or `limit`.

## Interoperability and scope

The generated XML is an adapter input, not a standards-complete XMP serializer or ready-made PDF
metadata stream. Map fields to the target PDF library, validate date conventions there, and replace
the sample `lp` namespace as appropriate. This model does not read or write PDF bytes; generation is
linear in total field text length.

ESM, CommonJS, and TypeScript declarations are included. There are no runtime or peer dependencies;
TypeScript and Prettier are development-only.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
