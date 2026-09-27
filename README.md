# NyayaSetu

NyayaSetu is an India-focused assistant for understanding RTI rejections and
preparing first appeals. It is being developed for LexHack 2026.

## Product Direction

The application will help a user upload an RTI response or rejection, extract
the relevant facts, calculate appeal deadlines deterministically, explain the
response in plain language, connect every legal rule to an official source, and
generate an appeal-ready case packet.

The product is deliberately limited to the Indian Right to Information first
appeal workflow. It is not a general-purpose AI lawyer and will not claim to
provide definitive legal advice.

## Core Principles

- Official sources beside every legal rule
- Clear separation of extracted facts, deterministic checks, and AI-generated text
- Transparent deadline calculations
- Explicit uncertainty and human-review paths
- Privacy-conscious document handling
- A polished end-to-end workflow instead of a broad feature set

## Current Status

The first complete prototype is implemented. It includes:

- A responsive public landing page and privacy-first upload flow
- On-device OCR for JPG, PNG, and WebP photographs
- Local parsing for pasted response text and plain-text files
- Human verification of extracted dates before rules run
- An instant, prepared sample case for reliable judging
- Deterministic response and first-appeal deadline calculations
- Required-field and procedural checks under Sections 7 and 19
- A Section 10 severability prompt for non-exempt portions of records
- An auditable fact-to-rule-to-calculation reasoning ledger
- Curated official sources with source dates and limitations
- An editable first-appeal packet with print-to-PDF support
- Thirteen automated checks covering rules, parsing, scenarios, and source integrity

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Verification

```bash
npm test
npm run build
npm audit --omit=dev
```

## Prototype Boundary

Image OCR runs on-device with Tesseract.js. On first use, the browser downloads
the OCR worker and English language model, but the selected image is not sent to
an application server. Live PDF parsing is intentionally excluded after a
dependency security review. Users can photograph a response, paste its text,
upload a `.txt` export, or use the prepared sample. A production PDF workflow
should use a patched, sandboxed parser with strict file limits.

## Documentation

- [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md): rules, safety model, and limitations
- [`docs/DEVPOST_SUBMISSION.md`](docs/DEVPOST_SUBMISSION.md): submission copy and demo script
