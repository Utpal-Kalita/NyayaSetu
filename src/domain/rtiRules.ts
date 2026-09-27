import type {
  CaseAnalysis,
  ExtractedFact,
  Finding,
  ReasoningStep,
  RtiCaseInput,
  TimelineEvent,
} from './types'

const DAY_MS = 24 * 60 * 60 * 1000

export function addCalendarDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

export function differenceInCalendarDays(later: string, earlier: string) {
  const laterDate = new Date(`${later}T12:00:00Z`).getTime()
  const earlierDate = new Date(`${earlier}T12:00:00Z`).getTime()
  return Math.round((laterDate - earlierDate) / DAY_MS)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

export function analyzeRtiCase(
  input: RtiCaseInput,
  today = new Date().toISOString().slice(0, 10),
): CaseAnalysis {
  const responseDueDate = addCalendarDays(input.applicationDate, 30)
  const appealDueDate = addCalendarDays(input.receivedDate, 30)
  const responseDelayDays = Math.max(
    0,
    differenceInCalendarDays(input.responseDate, responseDueDate),
  )
  const daysUntilAppealDue = differenceInCalendarDays(appealDueDate, today)

  const facts: ExtractedFact[] = [
    {
      label: 'Application registration',
      value: input.registrationNumber,
      confidence: 'verified',
      evidence: 'Shown in the response subject line',
    },
    {
      label: 'Public authority',
      value: input.publicAuthority,
      confidence: 'high',
      evidence: 'Shown in the response signature block',
    },
    {
      label: 'Application date',
      value: formatDate(input.applicationDate),
      confidence: 'verified',
      evidence: 'Referenced in the opening paragraph',
    },
    {
      label: 'Response received',
      value: formatDate(input.receivedDate),
      confidence: 'high',
      evidence: 'Using the response date; confirm actual receipt date',
    },
    {
      label: 'Exemption cited',
      value: input.rejectionSections.join(', ') || 'None detected',
      confidence: input.rejectionSections.length ? 'verified' : 'review',
      evidence: input.rejectionSections.length
        ? 'Explicitly cited in the response'
        : 'No statutory section was detected',
    },
  ]

  const findings: Finding[] = []

  if (responseDelayDays > 0) {
    findings.push({
      id: 'late-response',
      title: `Response appears ${responseDelayDays} days beyond the standard period`,
      detail:
        'The standard 30-day response period is calculated from the application date shown. Confirm the public authority’s actual receipt date and whether another statutory timing rule applies.',
      tone: 'warning',
      sourceId: 'rti-7-1',
    })
    findings.push({
      id: 'free-information',
      title: 'Delayed information may need to be supplied free of charge',
      detail:
        'Section 7(6) addresses fees when a public authority does not comply with the applicable Section 7(1) time limit.',
      tone: 'neutral',
      sourceId: 'rti-7-6',
    })
  }

  if (!input.responseIncludesAppealPeriod) {
    findings.push({
      id: 'missing-period',
      title: 'Appeal period was not detected',
      detail:
        'A rejection communication should state the period within which an appeal may be preferred.',
      tone: 'warning',
      sourceId: 'rti-7-8',
    })
  }

  if (!input.responseIncludesReasons) {
    findings.push({
      id: 'missing-reasons',
      title: 'Reasons for rejection were not detected',
      detail:
        'A rejection communication should explain the reasons for rejecting the request. Confirm the full response was included before raising this point.',
      tone: 'warning',
      sourceId: 'rti-7-8',
    })
  }

  if (!input.responseIncludesAppellateAuthority) {
    findings.push({
      id: 'missing-authority',
      title: 'Appellate authority details were not detected',
      detail:
        'A rejection communication should provide particulars of the appellate authority.',
      tone: 'warning',
      sourceId: 'rti-7-8',
    })
  }

  if (input.rejectionSections.length) {
    findings.push({
      id: 'exemption-review',
      title: `${input.rejectionSections.join(', ')} requires a contextual review`,
      detail:
        'NyayaSetu records the exemption but does not decide whether it was correctly applied. The appeal can ask the authority to explain how the exemption applies to each requested record.',
      tone: 'neutral',
      sourceId: 'rti-19-1',
    })
    findings.push({
      id: 'severability-review',
      title: 'Ask whether any non-exempt portion can be separated',
      detail:
        'Even where part of a record is exempt, Section 10 addresses access to portions that can reasonably be severed from exempt information.',
      tone: 'positive',
      sourceId: 'rti-10-1',
    })
  }

  const timeline: TimelineEvent[] = [
    {
      label: 'RTI application',
      date: formatDate(input.applicationDate),
      state: 'past',
      detail: 'Date stated in the response',
    },
    {
      label: 'Standard response date',
      date: formatDate(responseDueDate),
      state: 'past',
      detail: '30 calendar days from application date',
    },
    {
      label: 'Response received',
      date: formatDate(input.receivedDate),
      state: 'current',
      detail: responseDelayDays
        ? `${responseDelayDays} days after the calculated standard date`
        : 'Within the calculated standard period',
    },
    {
      label: 'First appeal target',
      date: formatDate(appealDueDate),
      state: 'future',
      detail: '30 calendar days from receipt of decision',
    },
  ]

  const reasoning: ReasoningStep[] = [
    {
      label: 'Document fact',
      value: `The response was received on ${formatDate(input.receivedDate)}.`,
      kind: 'fact',
    },
    {
      label: 'Applicable rule',
      value: 'A person aggrieved by a decision may prefer a first appeal within 30 days from receipt.',
      kind: 'rule',
      sourceId: 'rti-19-1',
    },
    {
      label: 'Calculation',
      value: `${formatDate(input.receivedDate)} + 30 calendar days = ${formatDate(appealDueDate)}.`,
      kind: 'calculation',
    },
    {
      label: 'Suggested action',
      value: `Prepare the first appeal for filing by ${formatDate(appealDueDate)}. Confirm the receipt date before relying on this calculation.`,
      kind: 'action',
    },
  ]

  const appealGrounds = [
    responseDelayDays > 0
      ? `The response dated ${formatDate(input.responseDate)} appears to fall after the standard 30-day period calculated from the stated application date.`
      : 'The response should be reviewed against the applicable statutory response period.',
    !input.responseIncludesAppealPeriod
      ? 'The response does not appear to communicate the period within which a first appeal may be preferred.'
      : 'The stated appeal period should be verified.',
    !input.responseIncludesAppellateAuthority
      ? 'The response does not appear to provide particulars of the First Appellate Authority.'
      : 'The supplied appellate authority details should be verified.',
    `The response cites ${input.rejectionSections.join(', ') || 'an unspecified basis'}. The appellant requests a record-by-record explanation of how the cited exemption applies.`,
  ]

  return {
    input,
    status: daysUntilAppealDue < 0 ? 'review-needed' : 'appeal-window-open',
    statusLabel:
      daysUntilAppealDue < 0
        ? 'Deadline passed: review condonation option'
        : 'First appeal window appears open',
    summary: `The response rejects the request using ${input.rejectionSections.join(', ') || 'a basis that was not detected'}. We found ${findings.filter((item) => item.tone === 'warning').length} procedural issues to raise in a first appeal. The exemption itself needs human review.`,
    responseDueDate,
    appealDueDate,
    responseDelayDays,
    daysUntilAppealDue,
    facts,
    findings,
    timeline,
    reasoning,
    appealGrounds,
    evidenceChecklist: [
      'Original RTI application and acknowledgement',
      'Public authority response or rejection letter',
      'Proof of the date the response was received',
      'Original registration number',
      'Any supporting records referred to in the application',
    ],
  }
}
