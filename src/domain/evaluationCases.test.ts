import { describe, expect, it } from 'vitest'
import { analyzeRtiCase } from './rtiRules'
import type { RtiCaseInput } from './types'

const baseCase: RtiCaseInput = {
  applicantName: 'Test applicant',
  registrationNumber: 'TEST/R/E/26/00001',
  publicAuthority: 'Test authority',
  applicationDate: '2026-01-01',
  responseDate: '2026-01-31',
  receivedDate: '2026-01-31',
  pioName: 'CPIO',
  rejectionSections: ['Section 8(1)(h)'],
  responseIncludesReasons: true,
  responseIncludesAppealPeriod: true,
  responseIncludesAppellateAuthority: true,
  responseText: 'Evaluation fixture',
}

describe('evaluation scenarios', () => {
  it('does not flag an on-time, procedurally complete response', () => {
    const analysis = analyzeRtiCase(baseCase, '2026-02-05')

    expect(analysis.responseDelayDays).toBe(0)
    expect(analysis.findings.map((finding) => finding.id)).not.toEqual(
      expect.arrayContaining(['late-response', 'missing-period', 'missing-authority']),
    )
  })

  it('flags every missing rejection communication element', () => {
    const analysis = analyzeRtiCase(
      {
        ...baseCase,
        responseIncludesReasons: false,
        responseIncludesAppealPeriod: false,
        responseIncludesAppellateAuthority: false,
      },
      '2026-02-05',
    )

    expect(analysis.findings.map((finding) => finding.id)).toEqual(
      expect.arrayContaining(['missing-reasons', 'missing-period', 'missing-authority']),
    )
  })

  it('moves an expired first-appeal target to review-needed', () => {
    const analysis = analyzeRtiCase(baseCase, '2026-04-01')

    expect(analysis.appealDueDate).toBe('2026-03-02')
    expect(analysis.daysUntilAppealDue).toBeLessThan(0)
    expect(analysis.status).toBe('review-needed')
  })

  it('handles a leap-day boundary with calendar arithmetic', () => {
    const analysis = analyzeRtiCase(
      {
        ...baseCase,
        applicationDate: '2024-02-10',
        responseDate: '2024-03-11',
        receivedDate: '2024-03-11',
      },
      '2024-03-15',
    )

    expect(analysis.responseDueDate).toBe('2024-03-11')
    expect(analysis.appealDueDate).toBe('2024-04-10')
  })
})
