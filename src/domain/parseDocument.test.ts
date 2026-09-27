import { describe, expect, it } from 'vitest'
import { parseRtiResponse } from './parseDocument'
import { sampleCase } from './sampleCase'

describe('RTI response parser', () => {
  it('extracts the prepared sample core fields', () => {
    const parsed = parseRtiResponse(sampleCase.responseText)

    expect(parsed.registrationNumber).toBe('DOP&T/R/E/26/00417')
    expect(parsed.applicationDate).toBe('2026-08-12')
    expect(parsed.responseDate).toBe('2026-09-18')
    expect(parsed.rejectionSections).toContain('Section 8(1)(j)')
    expect(parsed.responseIncludesAppellateAuthority).toBe(false)
  })

  it('detects appeal guidance when it is present', () => {
    const parsed = parseRtiResponse(`
      Application dated 1 September 2026.
      You may appeal within 30 days to the First Appellate Authority.
      Date: 20 September 2026
    `)

    expect(parsed.responseIncludesAppealPeriod).toBe(true)
    expect(parsed.responseIncludesAppellateAuthority).toBe(true)
  })

  it('reads Indian numeric dates in document order', () => {
    const parsed = parseRtiResponse(`
      Application dated 04/07/2026
      Information is denied under Section 8(1)(h).
      Response date: 09-08-2026
    `)

    expect(parsed.applicationDate).toBe('2026-07-04')
    expect(parsed.responseDate).toBe('2026-08-09')
    expect(parsed.rejectionSections).toContain('Section 8(1)(h)')
  })
})
