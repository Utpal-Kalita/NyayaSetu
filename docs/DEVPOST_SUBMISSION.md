# Devpost Submission Draft

## Project Name

NyayaSetu

## Tagline

Turn an RTI rejection into a source-backed first-appeal action plan.

## Short Summary

NyayaSetu helps Indian citizens understand Central Government RTI responses. It
uses on-device OCR and a constrained LLM to extract meaning, explain the letter
in plain language, disclose uncertainty, and suggest appeal questions. A
separate deterministic engine calculates deadlines, detects missing appeal
information, links every legal rule to an official source, and creates an
editable first-appeal packet.

## Inspiration

The right to information is only useful when people can understand and act on
the response they receive. Rejection letters can cite unfamiliar sections,
omit practical appeal details, and arrive against a running deadline. A generic
chatbot can make this worse by confidently inventing rules. We wanted to build a
tool that is helpful precisely because it is narrow, inspectable, and honest
about uncertainty.

## What It Does

Users can photograph an RTI response, paste its text, upload a plain-text
export, or open a safe sample case. On-device OCR and local parsing extract the
document's dates, registration number, authority, and cited sections. The user
confirms those facts before a deterministic rules engine checks the
standard response period, calculates the first-appeal target, and tests whether
the rejection appears to include the appeal period and appellate authority.

The result is presented as an auditable reasoning ledger:

```text
document fact -> official rule -> calculation -> suggested action
```

The user can inspect each official source and generate an editable appeal
outline, chronology, and evidence checklist.

## How We Built It

- React and TypeScript for the application
- Vite for development and production bundling
- Tesseract.js for lazy-loaded, on-device English OCR
- Llama 3.3 70B through Groq for low-latency live interpretation
- Vercel AI Gateway integration with short-lived OIDC authentication
- Schema-constrained LLM output for plain-language interpretation
- A deterministic TypeScript rule engine for legal deadlines
- Local, heuristic extraction for pasted text and `.txt` files
- Curated Central Information Commission and RTI Online sources
- Browser print support for PDF packet export
- Vitest for rules and parser verification

Images are read on-device. For live AI interpretation, extracted text is sent
to the configured server-side LLM endpoint and is not logged by the application.
The prepared judging case uses a cached AI response for demo reliability.

## Responsible AI and Safety

NyayaSetu does not let generated prose determine deadlines. It separates
document facts, sourced rules, calculations, and suggestions in the interface.
It does not decide whether an exemption is valid, predict an appeal outcome, or
present itself as a lawyer. Missing information is surfaced for review rather
than guessed.

## Challenges

The central design challenge was not generating more legal text. It was deciding
what the system must never infer. We constrained the product to one appellate
workflow, removed an unsuitable PDF dependency after a security review, moved
image OCR on-device, and inserted a human checkpoint before the rules engine.

## Accomplishments

- Complete mobile and desktop workflow
- On-device OCR with an explicit human verification step
- Transparent calendar-based appeal calculation
- Curated source viewer for every displayed legal rule
- Prepared sample that demonstrates both procedural and safety findings
- Editable, printable first-appeal packet
- Thirteen passing automated checks across rules, parsing, scenarios, and source integrity
- Deployment-ready Vercel configuration with conservative browser security headers

## What Is Next

The next step is a review with RTI practitioners and a small usability study.
After that, we would add Hindi and regional-language OCR and explanations, a
verified First Appellate Authority lookup, sandboxed PDF support, and a
published evaluation dataset before supporting additional jurisdictions.

## Demo Script

### 0:00-0:18: Problem

"An RTI response can decide whether a citizen gets public information, but the
letter may omit appeal details while a deadline is already running. Generic AI
answers are not safe enough for that workflow."

### 0:18-0:35: Product

"NyayaSetu turns one Central Government RTI response into a source-backed,
auditable first-appeal action plan."

### 0:35-1:10: Prepared Case

Open **Try a sample case**. Show the extracted registration number, authority,
dates, cited exemption, and the calculated appeal target.

### 1:10-1:35: Findings

Show the late-response check and the two missing appeal-detail findings. Open a
source drawer and point to the official authority, passage, and source URL.

### 1:35-1:55: Safety

Open the reasoning ledger. Explain that the deadline is calculated in code and
that the tool deliberately refuses to judge whether Section 8(1)(j) was
correctly applied.

### 1:55-2:20: Action

Open the appeal packet, show the generated grounds and evidence checklist, then
use **Save as PDF**.

### 2:20-2:35: Close

"NyayaSetu does not replace an advocate. It makes the first step understandable,
traceable, and easier to take."
