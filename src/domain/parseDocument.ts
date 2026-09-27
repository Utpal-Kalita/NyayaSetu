import type { RtiCaseInput } from './types'

const monthNames: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}

function toIsoDate(day: string, month: string, year: string) {
  const monthNumber = monthNames[month.toLowerCase()]
  if (!monthNumber) return ''
  return `${year}-${String(monthNumber).padStart(2, '0')}-${day.padStart(2, '0')}`
}

function extractDates(text: string) {
  const pattern = /\b(?:(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})|(\d{1,2})[\/-](\d{1,2})[\/-](20\d{2}))\b/gi

  return [...text.matchAll(pattern)].map((match) => {
    if (match[1] && match[2] && match[3]) {
      return toIsoDate(match[1], match[2], match[3])
    }

    return `${match[6]}-${match[5].padStart(2, '0')}-${match[4].padStart(2, '0')}`
  })
}

export function parseRtiResponse(text: string): RtiCaseInput {
  const dates = extractDates(text)
  const registration = text.match(/\b[A-Z][A-Z&/.\-]+\/R\/[A-Z]\/\d{2}\/\d{4,6}\b/i)?.[0]
  const sections = [
    ...new Set(
      [...text.matchAll(/section\s+(\d+[A-Za-z]?(?:\(\d+\))?(?:\([a-z]\))?)/gi)].map(
        (match) => `Section ${match[1]}`,
      ),
    ),
  ]

  const authorityLine = text
    .split('\n')
    .map((line) => line.trim())
    .find((line) => /department|ministry|authority|commission/i.test(line))

  const responseDate = dates.at(-1) ?? new Date().toISOString().slice(0, 10)

  return {
    applicantName: 'Applicant',
    registrationNumber: registration ?? 'Not detected',
    publicAuthority: authorityLine ?? 'Public authority not detected',
    applicationDate: dates[0] ?? responseDate,
    responseDate,
    receivedDate: responseDate,
    pioName: /central public information officer|cpio/i.test(text)
      ? 'Central Public Information Officer'
      : 'Public Information Officer',
    rejectionSections: sections,
    responseIncludesReasons: /reason|because|as it relates|therefore|exempt/i.test(text),
    responseIncludesAppealPeriod: /within\s+\d+\s+days|appeal period/i.test(text),
    responseIncludesAppellateAuthority: /first appellate authority|appellate authority|faa\b/i.test(text),
    responseText: text,
  }
}
