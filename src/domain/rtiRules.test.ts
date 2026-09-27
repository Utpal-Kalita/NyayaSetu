import { describe, expect, it } from 'vitest'
import { sampleCase } from './sampleCase'
import {
  addCalendarDays,
  analyzeRtiCase,
  differenceInCalendarDays,
} from './rtiRules'

describe('RTI deadline rules', () => {
  it('adds calendar days across month boundaries', () => {
    expect(addCalendarDays('2026-09-18', 30)).toBe('2026-10-18')
  })

  it('calculates signed calendar-day differences', () => {
    expect(differenceInCalendarDays('2026-09-18', '2026-09-11')).toBe(7)
    expect(differenceInCalendarDays('2026-09-11', '2026-09-18')).toBe(-7)
  })

  it('flags the sample response and calculates its appeal target', () => {
    const analysis = analyzeRtiCase(sampleCase, '2026-09-25')

    expect(analysis.responseDueDate).toBe('2026-09-11')
    expect(analysis.responseDelayDays).toBe(7)
    expect(analysis.appealDueDate).toBe('2026-10-18')
    expect(analysis.daysUntilAppealDue).toBe(23)
    expect(analysis.findings.map((finding) => finding.id)).toEqual(
      expect.arrayContaining(['late-response', 'missing-period', 'missing-authority']),
    )
  })
})
