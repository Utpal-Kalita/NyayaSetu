import type { RtiCaseInput } from './types'

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
