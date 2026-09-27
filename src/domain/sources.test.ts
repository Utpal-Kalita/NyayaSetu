import { describe, expect, it } from 'vitest'
import { getSource, sources } from './sources'

const approvedHosts = new Set(['cic.gov.in', 'rtionline.gov.in'])

describe('curated legal sources', () => {
  it('uses unique source identifiers', () => {
    const ids = sources.map((source) => source.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('links every rule to an approved official HTTPS host', () => {
    for (const source of sources) {
      const url = new URL(source.url)
      expect(url.protocol).toBe('https:')
      expect(approvedHosts.has(url.hostname)).toBe(true)
    }
  })

  it('provides an authority, quote, and review date for every source', () => {
    for (const source of sources) {
      expect(source.authority.length).toBeGreaterThan(0)
      expect(source.quote.length).toBeGreaterThan(40)
      expect(source.checkedOn).toMatch(/^\d{2} [A-Z][a-z]{2} \d{4}$/)
      expect(getSource(source.id)).toEqual(source)
    }
  })
})
