import type { Source } from './types'

export const sources: Source[] = [
  {
    id: 'rti-7-1',
    label: 'Right to Information Act, 2005',
    shortLabel: 'RTI Act, Section 7(1)',
    section: 'Section 7(1)',
    quote:
      'The Central Public Information Officer or State Public Information Officer shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request, either provide the information or reject the request.',
    url: 'https://cic.gov.in/sites/default/files/RTI_English.pdf',
    authority: 'Central Information Commission',
    checkedOn: '25 Sep 2026',
  },
  {
    id: 'rti-7-8',
    label: 'Right to Information Act, 2005',
    shortLabel: 'RTI Act, Section 7(8)',
    section: 'Section 7(8)',
    quote:
      'Where a request has been rejected, the Central or State Public Information Officer shall communicate the reasons for rejection, the period within which an appeal may be preferred, and the particulars of the appellate authority.',
    url: 'https://cic.gov.in/sites/default/files/RTI_English.pdf',
    authority: 'Central Information Commission',
    checkedOn: '25 Sep 2026',
  },
  {
    id: 'rti-7-6',
    label: 'Right to Information Act, 2005',
    shortLabel: 'RTI Act, Section 7(6)',
    section: 'Section 7(6)',
    quote:
      'The person making request for the information shall be provided the information free of charge where a public authority fails to comply with the time limits specified in sub-section (1).',
    url: 'https://cic.gov.in/sites/default/files/RTI_English.pdf',
    authority: 'Central Information Commission',
    checkedOn: '25 Sep 2026',
  },
  {
    id: 'rti-19-1',
    label: 'Right to Information Act, 2005',
    shortLabel: 'RTI Act, Section 19(1)',
    section: 'Section 19(1)',
    quote:
      'A person who does not receive a decision within the specified time, or is aggrieved by a decision, may within thirty days from expiry of that period or receipt of that decision prefer an appeal to an officer senior in rank to the Public Information Officer.',
    url: 'https://cic.gov.in/sites/default/files/RTI_English.pdf',
    authority: 'Central Information Commission',
    checkedOn: '25 Sep 2026',
  },
  {
    id: 'rti-10-1',
    label: 'Right to Information Act, 2005',
    shortLabel: 'RTI Act, Section 10(1)',
    section: 'Section 10(1)',
    quote:
      'Where a request is rejected because information is exempt, access may be provided to the part of the record that does not contain exempt information and can reasonably be severed.',
    url: 'https://cic.gov.in/sites/default/files/RTI_English.pdf',
    authority: 'Central Information Commission',
    checkedOn: '25 Sep 2026',
  },
  {
    id: 'rti-online-first-appeal',
    label: 'Guidelines for use of RTI Online Portal',
    shortLabel: 'RTI Online Guidelines 16-18',
    section: 'Guidelines 16-18',
    quote:
      'Use the original application registration number to file a first appeal. As per the RTI Act, no fee has to be paid for first appeal.',
    url: 'https://rtionline.gov.in/guidelines.php?request',
    authority: 'Department of Personnel and Training',
    checkedOn: '25 Sep 2026',
  },
]

export function getSource(id: string) {
  return sources.find((source) => source.id === id)
}
