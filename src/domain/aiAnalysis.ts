import type { AiAnalysis, RtiCaseInput } from './types'

const unavailableAnalysis: AiAnalysis = {
  mode: 'unavailable',
  plainLanguageSummary:
    'AI interpretation is temporarily unavailable. The verified rules, deadline calculation, and procedural checks below are still complete.',
  keyIssues: [],
  questionsToRaise: [],
  uncertainties: ['Review the extracted document text manually before relying on the appeal draft.'],
  safetyNote: 'Deterministic legal checks continue to work without the AI service.',
}

export async function requestAiAnalysis(input: RtiCaseInput): Promise<AiAnalysis> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentText: input.responseText }),
    })

    if (!response.ok) return unavailableAnalysis

    const analysis = (await response.json()) as Omit<AiAnalysis, 'mode'>
    return { ...analysis, mode: 'live' }
  } catch {
    return unavailableAnalysis
  }
}
