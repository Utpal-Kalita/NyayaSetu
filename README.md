# NyayaSetu

**Explainable AI that turns an Indian RTI rejection into a source-backed first-appeal plan.**

Built for [LexHack 2026](https://nyayasetu-neon.vercel.app).

[Live application](https://nyayasetu-neon.vercel.app) | [Methodology](docs/METHODOLOGY.md) | [Devpost draft](docs/DEVPOST_SUBMISSION.md)

## The Problem

An RTI rejection may contain technical legal language, an unfamiliar exemption,
missing appeal instructions, and a deadline that is already running. Generic
legal chatbots can make the situation worse by mixing generated claims with
legal rules and calculations.

NyayaSetu uses AI where language understanding helps and deterministic software
where correctness must be inspectable.

## What It Does

A user can photograph an RTI response, paste its text, upload a plain-text file,
or open a safe prepared case. NyayaSetu then:

- Reads photographs locally with Tesseract LSTM OCR
- Requires the user to confirm extracted facts and dates
- Uses Llama 3.3 70B through Groq to explain the response in plain language
- Identifies document-level issues and useful appeal questions
- Explicitly discloses uncertainty and missing context
- Calculates response and first-appeal dates with deterministic TypeScript
- Checks procedural requirements under Sections 7, 10, and 19 of the RTI Act
- Links every displayed legal rule to a curated official source
- Generates an editable first-appeal draft and evidence checklist
- Produces an auditable fact-to-rule-to-calculation reasoning ledger

## Live Demo

Open **[nyayasetu-neon.vercel.app](https://nyayasetu-neon.vercel.app)**.

For the fastest walkthrough, select **Try a sample case**. To demonstrate live
AI, select **Analyze with AI**, paste an RTI response, verify the extracted
fields, and confirm the analysis.

The prepared case uses a clearly labeled cached AI interpretation for demo
reliability. User-provided text uses the live production endpoint.

## Architecture

```text
Photograph or response text
        |
        v
On-device Tesseract OCR
        |
        v
Human verification checkpoint
        |
        +-------------------------------+
        |                               |
        v                               v
Guarded Llama 3.3 LLM            Deterministic RTI engine
        |                               |
Plain-language explanation        Deadline calculations
Issue and question generation     Procedural checks
Uncertainty disclosure            Official legal sources
        |                               |
        +---------------+---------------+
                        |
                        v
              First-appeal packet
```

## Why This Is Not A Legal Chatbot

The LLM is an interpretation layer, not the legal authority. It cannot:

- Calculate or modify deadlines
- Select or invent legal rules
- Create unsupported citations
- Decide whether an exemption was lawfully applied
- Predict whether an appeal will succeed
- Replace a lawyer or RTI practitioner

Every high-stakes conclusion is separated into four visible stages:

```text
document fact -> official rule -> deterministic calculation -> suggested action
```

If the AI service fails, the sourced rules and deadline calculations continue to
work.

## AI Stack

- **Document vision:** Tesseract.js LSTM OCR, loaded on demand in the browser
- **Language model:** Llama 3.3 70B Versatile through Groq
- **Model contract:** Strict JSON containing a summary, issues, questions,
  uncertainties, and a safety note
- **Provider fallback:** Pollinations' OpenAI-compatible endpoint for prototype
  resilience
- **Deployment identity:** Vercel OIDC support for AI Gateway integrations
- **Prompt-injection boundary:** Uploaded text is delimited and treated only as
  untrusted document data

## Legal Rules

The current prototype focuses on the Indian Central Government RTI first-appeal
workflow and implements a deliberately small rule set:

| Rule | Purpose |
| --- | --- |
| Section 7(1) | Standard response-period check |
| Section 7(6) | Delayed-response fee note |
| Section 7(8) | Required rejection communication details |
| Section 10(1) | Severability of non-exempt information |
| Section 19(1) | First-appeal target calculation |
| RTI Online Guidelines | Registration reference and first-appeal fee guidance |

Sources are curated in [`src/domain/sources.ts`](src/domain/sources.ts) and link
to the Central Information Commission or the official RTI Online portal.

## Privacy

- Source images are processed locally and are not uploaded.
- The user verifies extracted information before analysis.
- Confirmed text is sent to the configured model provider.
- The application does not intentionally persist documents.
- There are no user accounts, analytics, or document databases.
- Model credentials remain in encrypted server-side environment variables.

Do not process sensitive real-world documents until provider retention terms
and production data controls have been formally reviewed.

## Technology

- React 19
- TypeScript
- Vite
- Tesseract.js
- Groq API
- Llama 3.3 70B Versatile
- Vercel Functions
- Vercel AI Gateway integration
- Vitest

## Run Locally

```bash
npm install
npm run dev
```

The prepared sample works without credentials. For live local AI, copy the
example environment file and provide an OpenAI-compatible server-side key:

```bash
cp .env.example .env.local
```

Never expose a model credential through a `VITE_` environment variable.

## Verification

```bash
npm test
npm run build
npm audit
```

The repository currently contains 13 automated checks covering:

- Calendar arithmetic and leap-year boundaries
- Response-delay and first-appeal calculations
- Expired appeal windows
- Missing rejection details
- Written and numeric Indian date extraction
- Prepared-case behavior
- Official-source domain and metadata integrity

No unsupported OCR, model, or legal-accuracy percentage is claimed.

## Limitations

- The initial scope covers Central Government first appeals, not every RTI jurisdiction.
- OCR currently recognizes English JPG, PNG, and WebP images.
- PDF processing is intentionally excluded from this prototype.
- The system does not identify the correct appellate authority automatically.
- Exemption validity and public-interest tests require qualified human review.
- NyayaSetu provides civic information, not legal advice.

## Roadmap

- Review with RTI practitioners and legal-aid organizations
- Hindi and regional-language OCR and explanations
- Verified First Appellate Authority lookup
- Sandboxed PDF processing
- A larger anonymized evaluation dataset
- Additional administrative appeal workflows after expert review

## License

Released under the [MIT License](LICENSE).
