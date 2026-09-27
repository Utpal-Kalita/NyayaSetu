import type { AiAnalysis, RtiCaseInput } from './types'

export const sampleCase: RtiCaseInput = {
  applicantName: 'Aarav Mehta',
  registrationNumber: 'DOP&T/R/E/26/00417',
  publicAuthority: 'Department of Personnel & Training',
  applicationDate: '2026-08-12',
  responseDate: '2026-09-18',
  receivedDate: '2026-09-18',
  pioName: 'Central Public Information Officer',
  rejectionSections: ['Section 8(1)(j)'],
  responseIncludesReasons: true,
  responseIncludesAppealPeriod: false,
  responseIncludesAppellateAuthority: false,
  responseText: `Subject: Response to RTI application DOP&T/R/E/26/00417

Your application dated 12 August 2026 requested records concerning the selection process for contractual consultants. The requested information cannot be supplied under Section 8(1)(j) of the Right to Information Act, 2005, as it relates to personal information.

This disposes of your RTI application.

Date: 18 September 2026
Central Public Information Officer
Department of Personnel & Training`,
}

export const sampleAiAnalysis: AiAnalysis = {
  mode: 'cached',
  plainLanguageSummary:
    'The department has refused the entire request because it considers the requested material personal information. The letter does not explain which individual records were examined, whether any non-personal portions could be released, or how to file a first appeal.',
  keyIssues: [
    'One exemption is applied to the whole request without a record-by-record explanation.',
    'The response does not identify the First Appellate Authority or state the appeal period.',
    'The letter does not discuss whether non-exempt portions could be separated and disclosed.',
  ],
  questionsToRaise: [
    'Which specific records or fields were considered personal information?',
    'Can non-exempt portions be disclosed after severing protected information under Section 10?',
    'Who is the designated First Appellate Authority for this application?',
  ],
  uncertainties: [
    'The original RTI application is not included, so the exact breadth of each request cannot be verified.',
    'The AI cannot determine whether Section 8(1)(j) was lawfully applied from this letter alone.',
  ],
  safetyNote:
    'Prepared AI interpretation for the sample case. Dates, legal rules, and citations are calculated separately by the deterministic engine.',
}
