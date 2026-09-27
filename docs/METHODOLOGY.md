# Methodology and Safety Model

## Scope

NyayaSetu currently addresses one workflow: reviewing a response to an Indian
Central Government RTI application and preparing material for a first appeal.
It does not determine whether an exemption was lawfully applied and does not
predict an appeal outcome.

## Analysis Layers

The application deliberately keeps four kinds of information separate:

1. **Document facts:** dates, registration number, public authority, cited
   sections, and text detected in the supplied response.
2. **Curated rules:** small records linked to the Central Information
   Commission or the official RTI Online portal.
3. **Deterministic calculations:** calendar arithmetic implemented in
   `src/domain/rtiRules.ts` and covered by unit tests.
4. **Suggested actions:** editable language derived from the preceding layers,
   accompanied by limitations and review prompts.
5. **Constrained AI interpretation:** a schema-validated plain-language summary,
   issue list, questions, and explicit uncertainties. This layer cannot change
   facts, rules, citations, or deadline calculations.

This separation makes mistakes observable. A user can identify an incorrect
date before relying on a resulting deadline.

## Rules Implemented

- Standard 30-day response check based on Section 7(1)
- Delayed-response fee note based on Section 7(6)
- Rejection communication checks based on Section 7(8)
- Severability review prompt based on Section 10(1)
- First-appeal target calculation based on Section 19(1)
- Central portal guidance that the original registration number is used and no
  first-appeal fee is payable

The response date check uses the application date extracted from the letter as
a proxy for receipt by the public authority. The interface explicitly asks the
user to confirm the actual receipt date before relying on it. Special timing
rules, transfers, third-party consultation, life-or-liberty requests, holidays,
state rules, and court interpretations are outside this prototype.

## Source Policy

Only curated official URLs are allowed to support displayed legal rules. Each
source record contains the responsible authority and the date it was checked.
Displayed passages may be shortened for readability, and the interface directs
the user to review the original document.

The current source set is defined in `src/domain/sources.ts`.

## Privacy and Security

- Pasted text, plain-text files, and response photographs are processed in the browser.
- Image OCR uses a lazy-loaded Tesseract.js worker and English recognition model.
- First use downloads OCR runtime and language assets; the selected document is not sent to an application server.
- The application has no analytics, accounts, database, or persistent document
  storage. Live AI analysis sends extracted text to the configured model
  provider through a Vercel server function without application logging.
- Production model requests use Vercel AI Gateway and the deployment's
  short-lived OIDC identity instead of a permanent browser-visible API key.
- The hackathon deployment temporarily falls back to Pollinations AI when
  Gateway billing is unavailable. Confirmed text may be sent to that provider;
  source images are never sent. Sensitive real-world use requires a contracted
  provider and reviewed retention terms.
- Uploaded document text is parsed as data and is never executed as code.
- PDF parsing is intentionally excluded after a dependency review identified an
  unsuitable parser release.
- A production PDF service should be sandboxed, ephemeral, size-limited,
  malware-scanned, and covered by a clear retention policy.

## Known Limitations

- Pattern extraction is heuristic and works best with English responses.
- The parser may confuse the issue date with the actual date of receipt.
- It does not identify the correct First Appellate Authority automatically.
- It does not assess the merits of exemptions, public-interest overrides,
  severability, or precedent.
- It processes English text in JPG, PNG, and WebP images, but not PDFs.
- OCR accuracy depends on lighting, focus, layout, and scan quality.
- It is a civic information prototype, not legal advice.

## Evaluation

The automated suite contains 13 checks covering calendar arithmetic, the
prepared sample's response and appeal dates, complete and incomplete rejection
letters, expired appeal windows, leap-year boundaries, parser extraction, and
the official-source allowlist. Larger evaluation claims must not be added to
the submission until a published fixture set supports them.
