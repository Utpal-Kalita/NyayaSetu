export type Confidence = 'verified' | 'high' | 'review'
export type FindingTone = 'positive' | 'warning' | 'neutral'

export interface Source {
  id: string
  label: string
  shortLabel: string
  section: string
  quote: string
  url: string
  authority: string
  checkedOn: string
}

export interface RtiCaseInput {
  applicantName: string
  registrationNumber: string
  publicAuthority: string
  applicationDate: string
  responseDate: string
  receivedDate: string
  pioName: string
  rejectionSections: string[]
  responseIncludesReasons: boolean
  responseIncludesAppealPeriod: boolean
  responseIncludesAppellateAuthority: boolean
  responseText: string
}

export interface ExtractedFact {
  label: string
  value: string
  confidence: Confidence
  evidence: string
}

export interface Finding {
  id: string
  title: string
  detail: string
  tone: FindingTone
  sourceId: string
}

export interface TimelineEvent {
  label: string
  date: string
  state: 'past' | 'current' | 'future'
  detail: string
}

export interface ReasoningStep {
  label: string
  value: string
  kind: 'fact' | 'rule' | 'calculation' | 'action'
  sourceId?: string
}

export interface CaseAnalysis {
  input: RtiCaseInput
  status: 'action-recommended' | 'appeal-window-open' | 'review-needed'
  statusLabel: string
  summary: string
  responseDueDate: string
  appealDueDate: string
  responseDelayDays: number
  daysUntilAppealDue: number
  facts: ExtractedFact[]
  findings: Finding[]
  timeline: TimelineEvent[]
  reasoning: ReasoningStep[]
  appealGrounds: string[]
  evidenceChecklist: string[]
}
