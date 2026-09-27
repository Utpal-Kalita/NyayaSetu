import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  FileSearch,
  FileText,
  Fingerprint,
  Info,
  Languages,
  LockKeyhole,
  Menu,
  MessageCircleQuestion,
  Quote,
  Scale,
  ScanText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserCheck,
  X,
} from 'lucide-react'
import { extractFileText } from './domain/extractFile'
import { requestAiAnalysis } from './domain/aiAnalysis'
import { parseRtiResponse } from './domain/parseDocument'
import { analyzeRtiCase, formatDate } from './domain/rtiRules'
import { sampleAiAnalysis, sampleCase } from './domain/sampleCase'
import { getSource, sources } from './domain/sources'
import type { CaseAnalysis, RtiCaseInput } from './domain/types'

type Screen = 'home' | 'upload' | 'review' | 'analyzing' | 'results'
type ResultTab = 'overview' | 'evidence' | 'appeal'

const analysisSteps = [
  'Reading document structure',
  'AI translating the response into plain language',
  'Applying verified RTI rules',
  'Cross-checking AI output against safeguards',
]

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null)
  const [pendingCase, setPendingCase] = useState<RtiCaseInput>(sampleCase)
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState<ResultTab>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (screen !== 'analyzing') return

    let cancelled = false

    const stepTimer = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, analysisSteps.length - 1))
    }, 430)

    const aiPromise = pendingCase.registrationNumber === sampleCase.registrationNumber
      ? Promise.resolve(sampleAiAnalysis)
      : requestAiAnalysis(pendingCase)

    void Promise.all([
      aiPromise,
      new Promise((resolve) => window.setTimeout(resolve, 1900)),
    ]).then(([ai]) => {
      if (cancelled) return
      setAnalysis({ ...analyzeRtiCase(pendingCase), ai })
      setScreen('results')
      setActiveStep(0)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    return () => {
      cancelled = true
      window.clearInterval(stepTimer)
    }
  }, [pendingCase, screen])

  function startAnalysis(input: RtiCaseInput) {
    setPendingCase(input)
    setScreen('analyzing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reviewExtraction(input: RtiCaseInput) {
    setPendingCase(input)
    setScreen('review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function returnHome() {
    setScreen('home')
    setActiveTab('overview')
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (screen === 'analyzing') {
    return <AnalyzingScreen activeStep={activeStep} />
  }

  if (screen === 'review') {
    return (
      <ReviewScreen
        value={pendingCase}
        onChange={setPendingCase}
        onBack={() => setScreen('upload')}
        onConfirm={() => startAnalysis(pendingCase)}
      />
    )
  }

  if (screen === 'results' && analysis) {
    return (
      <ResultsScreen
        analysis={analysis}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBack={() => setScreen('upload')}
        onHome={returnHome}
      />
    )
  }

  return (
    <div className="site-shell">
      <Header
        onHome={returnHome}
        onStart={() => setScreen('upload')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {screen === 'upload' ? (
        <UploadScreen
          onBack={returnHome}
          onExtract={reviewExtraction}
          onSample={() => startAnalysis(sampleCase)}
        />
      ) : (
        <HomeScreen
          onStart={() => setScreen('upload')}
          onSample={() => startAnalysis(sampleCase)}
        />
      )}
      <Footer />
    </div>
  )
}

function Header({
  onHome,
  onStart,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  onHome: () => void
  onStart: () => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}) {
  return (
    <header className="site-header">
      <button className="brand" onClick={onHome} aria-label="NyayaSetu home">
        <span className="brand-mark"><Scale size={20} strokeWidth={1.8} /></span>
        <span>NyayaSetu</span>
      </button>
      <nav className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a>
        <a href="#evaluation" onClick={() => setMobileMenuOpen(false)}>Evidence</a>
        <a href="#sources" onClick={() => setMobileMenuOpen(false)}>Sources</a>
        <button className="nav-cta" onClick={onStart}>Analyze with AI <ArrowRight size={15} /></button>
      </nav>
      <button
        className="menu-button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>
    </header>
  )
}

function HomeScreen({ onStart, onSample }: { onStart: () => void; onSample: () => void }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> AI × ACCESS TO JUSTICE</div>
          <h1>AI clarity for your<br /><em>RTI response.</em></h1>
          <p className="hero-lede">
            NyayaSetu combines on-device OCR, guarded LLM interpretation, and verified legal rules
            to turn a rejection into an auditable first-appeal plan.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onStart}>
              Analyze with AI <ArrowRight size={18} />
            </button>
            <button className="text-button" onClick={onSample}>
              <Sparkles size={17} /> Try a sample case
            </button>
          </div>
          <div className="privacy-note">
            <LockKeyhole size={15} /> Images stay local; confirmed text is sent only for AI interpretation.
          </div>
        </div>
        <div className="hero-art" aria-label="Example RTI response analysis">
          <div className="document-stack back" />
          <div className="document-stack middle" />
          <article className="sample-document">
            <div className="doc-topline">
              <span>GOVERNMENT OF INDIA</span>
              <span>18 SEP 2026</span>
            </div>
            <h3>Response to RTI application</h3>
            <div className="document-rule" />
            <p>Your application dated 12 August 2026 requested records concerning the selection process...</p>
            <p className="highlight-line">The requested information cannot be supplied under <strong>Section 8(1)(j)</strong> of the RTI Act.</p>
            <div className="doc-lines"><span /><span /><span /></div>
            <div className="doc-signature">Central Public Information Officer</div>
          </article>
          <div className="analysis-tag tag-one"><BrainCircuit size={16} /> AI issue spotting</div>
          <div className="analysis-tag tag-two"><Clock3 size={16} /> Deadline: deterministic</div>
          <div className="analysis-tag tag-three"><ShieldCheck size={16} /> Sources verified</div>
          <svg className="hero-scribble" viewBox="0 0 520 470" aria-hidden="true">
            <path d="M455 116C500 170 495 282 453 334" />
            <path d="M451 337l-15-20m15 20 22-12" />
          </svg>
        </div>
      </section>

      <section className="trust-ribbon" id="trust">
        <div><Fingerprint /><span><strong>On-device vision</strong>Images stay in your browser</span></div>
        <div><BrainCircuit /><span><strong>Guarded LLM</strong>Explains, questions, discloses doubt</span></div>
        <div><BookOpen /><span><strong>Verified law</strong>Rules use official sources</span></div>
        <div><UserCheck /><span><strong>Human control</strong>You confirm facts before action</span></div>
      </section>

      <section className="problem-section section-wrap">
        <div className="section-kicker">THE GAP WE CLOSE</div>
        <div className="problem-grid">
          <div>
            <h2>Legal AI should<br />explain itself.</h2>
          </div>
          <div className="problem-copy">
            <p>RTI responses are dense, incomplete, and time-sensitive. A generic chatbot can make things worse by inventing rules or hiding uncertainty.</p>
            <p>NyayaSetu gives AI one narrow job: understand the letter. Verified code handles legal rules and deadlines, while the citizen approves every extracted fact.</p>
          </div>
        </div>
        <div className="impact-strip">
          <div><strong>30</strong><span>calendar days in the standard first-appeal window</span></div>
          <div><strong>₹0</strong><span>fee for a central RTI first appeal online</span></div>
          <div><strong>100%</strong><span>of displayed rules linked to official sources</span></div>
        </div>
      </section>

      <section className="process-section" id="how-it-works">
        <div className="section-wrap">
          <div className="section-heading-row">
            <div>
              <div className="section-kicker light">A HYBRID AI SYSTEM</div>
              <h2>Three layers. One safe workflow.</h2>
            </div>
            <p>Each layer does only what it is good at, and every high-stakes conclusion remains inspectable.</p>
          </div>
          <div className="process-grid">
            <ProcessCard number="01" icon={<ScanText />} title="Vision reads" text="Tesseract's LSTM OCR extracts text from a photographed response on-device, without uploading the image." />
            <ProcessCard number="02" icon={<BrainCircuit />} title="The LLM explains" text="Groq-hosted Llama interprets the letter, spots issues, proposes questions, and names its uncertainties." />
            <ProcessCard number="03" icon={<ClipboardCheck />} title="Rules verify" text="Deterministic code calculates deadlines, checks procedure, and attaches official legal sources." />
          </div>
        </div>
      </section>

      <section className="ledger-section section-wrap">
        <div className="ledger-copy">
          <div className="section-kicker">EXPLAINABLE BY DESIGN</div>
          <h2>AI you can<br />actually audit.</h2>
          <p>Every high-stakes recommendation is assembled from visible evidence. The model interprets language; it never controls the law or the clock.</p>
          <button className="secondary-button" onClick={onSample}>Open the sample analysis <ArrowRight size={17} /></button>
        </div>
        <div className="ledger-visual">
          <LedgerItem marker="A" label="DOCUMENT FACT" value="Response received on 18 Sep 2026" tone="paper" />
          <LedgerConnector />
          <LedgerItem marker="B" label="VERIFIED RULE" value="First appeal: within 30 days of receipt" tone="blue" />
          <LedgerConnector />
          <LedgerItem marker="C" label="CALCULATION" value="18 Sep + 30 calendar days = 18 Oct" tone="paper" />
          <LedgerConnector />
          <LedgerItem marker="D" label="SUGGESTED ACTION" value="Prepare the appeal before 18 Oct 2026" tone="orange" />
        </div>
      </section>

      <section className="sources-section" id="sources">
        <div className="section-wrap sources-inner">
          <div>
            <div className="section-kicker light">SOURCE DISCIPLINE</div>
            <h2>Law, with receipts.</h2>
            <p>NyayaSetu uses a deliberately small, curated source set. It does not improvise legal rules from open-web search results.</p>
          </div>
          <div className="source-list">
            {sources.slice(0, 3).map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
                <span><small>{source.authority}</small>{source.shortLabel}</span>
                <ExternalLink size={18} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="evaluation-section section-wrap" id="evaluation">
        <div className="evaluation-heading">
          <div>
            <div className="section-kicker">EVIDENCE, NOT SUPERLATIVES</div>
            <h2>Proof before<br />promises.</h2>
          </div>
          <p>Our public evaluation is deliberately modest. It tests the rules we actually implement and names the legal questions we do not automate.</p>
        </div>
        <div className="evaluation-grid">
          <article className="score-card">
            <div className="score-ring"><strong>13</strong><span>checks<br />passing</span></div>
            <div><small>AUTOMATED VERIFICATION</small><h3>Rules, parsing, and sources</h3><p>Reproducible with <code>npm test</code>. No fabricated model-accuracy percentage.</p></div>
          </article>
          <div className="test-matrix">
            <div><span><CalendarDays /> Deadline arithmetic</span><strong>4 scenarios</strong></div>
            <div><span><ClipboardCheck /> Procedural findings</span><strong>Complete</strong></div>
            <div><span><ScanText /> Date extraction</span><strong>Text + numeric</strong></div>
            <div><span><BookOpen /> Source allowlist</span><strong>Official domains</strong></div>
          </div>
          <article className="non-claim-card">
            <ShieldCheck />
            <div><small>WHAT WE DO NOT CLAIM</small><h3>No invented accuracy score.</h3><p>We do not claim that OCR is perfect, exemptions are automatically resolved, or appeals will succeed. The human checkpoint exists because those claims would be unsafe.</p></div>
          </article>
        </div>
      </section>

      <section className="final-cta section-wrap">
        <div className="cta-seal"><Scale /></div>
        <div>
          <div className="section-kicker">AI CLARITY. HUMAN CONTROL.</div>
          <h2>Turn the letter into<br />an answer you can audit.</h2>
        </div>
        <button className="primary-button" onClick={onStart}>Analyze with AI <ArrowRight size={18} /></button>
      </section>
    </main>
  )
}

function ProcessCard({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="process-card">
      <span className="process-number">{number}</span>
      <div className="process-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function LedgerItem({ marker, label, value, tone }: { marker: string; label: string; value: string; tone: string }) {
  return (
    <div className={`ledger-item ${tone}`}>
      <span className="ledger-marker">{marker}</span>
      <div><small>{label}</small><strong>{value}</strong></div>
      {tone === 'blue' && <BookOpen size={18} />}
      {tone === 'orange' && <ArrowRight size={18} />}
    </div>
  )
}

function LedgerConnector() {
  return <div className="ledger-connector"><span /><ChevronDown size={16} /></div>
}

function UploadScreen({
  onBack,
  onExtract,
  onSample,
}: {
  onBack: () => void
  onExtract: (input: RtiCaseInput) => void
  onSample: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [reading, setReading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [pastedText, setPastedText] = useState('')
  const [ocrProgress, setOcrProgress] = useState(0)

  async function handleFile(selected?: File) {
    if (!selected) return
    if (selected.size > 10 * 1024 * 1024) {
      setError('Please choose a file smaller than 10 MB.')
      return
    }
    setError('')
    setFile(selected)
    setReading(true)
    setOcrProgress(0)
    try {
      const text = await extractFileText(selected, ({ progress }) => setOcrProgress(progress))
      onExtract(parseRtiResponse(text))
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : 'We could not read this file.')
      setReading(false)
    }
  }

  return (
    <main className="upload-page">
      <div className="upload-orbit orbit-one" />
      <div className="upload-orbit orbit-two" />
      <div className="upload-container">
        <button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Back to overview</button>
        <div className="upload-heading">
          <div className="eyebrow"><span /> PRIVATE, LOCAL ANALYSIS</div>
          <h1>Let's read the response<br /><em>together.</em></h1>
          <p>Paste a Central Government RTI response or photograph it. OCR stays on-device; confirmed text is sent for AI interpretation.</p>
        </div>
        <div
          className={dragging ? 'drop-zone is-dragging' : 'drop-zone'}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            void handleFile(event.dataTransfer.files[0])
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,text/plain,image/jpeg,image/png,image/webp"
            onChange={(event) => void handleFile(event.target.files?.[0])}
            hidden
          />
          <div className="upload-icon">{reading ? <ScanText size={30} /> : <UploadCloud size={30} />}</div>
          <h2>{reading ? 'Reading your document...' : file ? file.name : 'Drop your response here'}</h2>
          <p>{reading ? 'The image remains in this browser.' : 'JPG, PNG, WebP, or TXT, up to 10 MB'}</p>
          {reading && <div className="ocr-progress" aria-label={`OCR progress ${Math.round(ocrProgress * 100)} percent`}><span style={{ width: `${Math.max(5, ocrProgress * 100)}%` }} /></div>}
          <button className="primary-button" onClick={() => inputRef.current?.click()} disabled={reading}>
            {reading ? 'Processing' : 'Choose a file'}
          </button>
          {error && <div className="upload-error"><CircleAlert size={17} />{error}</div>}
        </div>
        <div className="sample-divider"><span />or paste the response<span /></div>
        <div className="paste-panel">
          <textarea
            value={pastedText}
            onChange={(event) => setPastedText(event.target.value)}
            placeholder="Paste the full text of the RTI response here..."
            aria-label="RTI response text"
          />
          <button
            className="secondary-button"
            disabled={pastedText.trim().length < 40}
            onClick={() => onExtract(parseRtiResponse(pastedText))}
          >
            Analyze pasted text <ArrowRight size={16} />
          </button>
        </div>
        <div className="sample-divider"><span />or skip document entry<span /></div>
        <button className="sample-case-button" onClick={onSample}>
          <div className="sample-file-icon"><FileText /></div>
          <span><strong>Explore a prepared sample case</strong><small>RTI rejection citing Section 8(1)(j)</small></span>
          <ArrowRight />
        </button>
        <div className="upload-assurances">
          <span><LockKeyhole /> No account required</span>
          <span><ShieldCheck /> Local image OCR</span>
          <span><Scale /> Not legal advice</span>
        </div>
      </div>
    </main>
  )
}

function ReviewScreen({
  value,
  onChange,
  onBack,
  onConfirm,
}: {
  value: RtiCaseInput
  onChange: (value: RtiCaseInput) => void
  onBack: () => void
  onConfirm: () => void
}) {
  const update = <K extends keyof RtiCaseInput>(key: K, nextValue: RtiCaseInput[K]) => {
    onChange({ ...value, [key]: nextValue })
  }

  return (
    <main className="review-page">
      <div className="review-container">
        <button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Back to document</button>
        <div className="review-header">
          <div>
            <div className="eyebrow"><span /> HUMAN CHECKPOINT</div>
            <h1>Confirm the facts.<br /><em>Then calculate.</em></h1>
            <p>OCR can misread dates and reference numbers. Correct anything below before NyayaSetu applies the RTI rules.</p>
          </div>
          <div className="human-loop-badge"><UserCheck /><span><strong>You stay in control</strong>No deadline is calculated until you confirm.</span></div>
        </div>

        <section className="review-form">
          <div className="review-section-heading"><span>01</span><div><h2>Document identity</h2><p>Check the authority and registration reference.</p></div></div>
          <div className="form-grid">
            <label><span>Registration number</span><input value={value.registrationNumber} onChange={(event) => update('registrationNumber', event.target.value)} /></label>
            <label><span>Public authority</span><input value={value.publicAuthority} onChange={(event) => update('publicAuthority', event.target.value)} /></label>
            <label><span>Applicant name</span><input value={value.applicantName} onChange={(event) => update('applicantName', event.target.value)} /></label>
            <label><span>PIO designation</span><input value={value.pioName} onChange={(event) => update('pioName', event.target.value)} /></label>
          </div>
        </section>

        <section className="review-form">
          <div className="review-section-heading"><span>02</span><div><h2>Dates used by the rules</h2><p>The receipt date controls the first-appeal calculation.</p></div></div>
          <div className="form-grid three">
            <label><span>RTI application date</span><input type="date" value={value.applicationDate} onChange={(event) => update('applicationDate', event.target.value)} /></label>
            <label><span>Response date</span><input type="date" value={value.responseDate} onChange={(event) => update('responseDate', event.target.value)} /></label>
            <label className="important-field"><span>Date you received it</span><input type="date" value={value.receivedDate} onChange={(event) => update('receivedDate', event.target.value)} /><small>Confirm from email, post, or portal.</small></label>
          </div>
        </section>

        <section className="review-form">
          <div className="review-section-heading"><span>03</span><div><h2>Rejection details</h2><p>These checks describe the letter; they do not decide the merits.</p></div></div>
          <label className="full-field"><span>Sections cited, separated by commas</span><input value={value.rejectionSections.join(', ')} onChange={(event) => update('rejectionSections', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></label>
          <div className="check-grid">
            <label><input type="checkbox" checked={value.responseIncludesReasons} onChange={(event) => update('responseIncludesReasons', event.target.checked)} /><span>The letter gives reasons for rejection</span></label>
            <label><input type="checkbox" checked={value.responseIncludesAppealPeriod} onChange={(event) => update('responseIncludesAppealPeriod', event.target.checked)} /><span>The letter states the appeal period</span></label>
            <label><input type="checkbox" checked={value.responseIncludesAppellateAuthority} onChange={(event) => update('responseIncludesAppellateAuthority', event.target.checked)} /><span>The letter identifies the appellate authority</span></label>
          </div>
          <details className="raw-text"><summary>Review extracted document text</summary><pre>{value.responseText}</pre></details>
        </section>

        <div className="review-submit">
          <div><ShieldCheck /><span><strong>Ready for guarded AI analysis</strong>Confirmed text is sent to the model; images are not uploaded.</span></div>
          <button className="primary-button" onClick={onConfirm}>Confirm and analyze <ArrowRight size={18} /></button>
        </div>
      </div>
    </main>
  )
}

function AnalyzingScreen({ activeStep }: { activeStep: number }) {
  return (
    <main className="analyzing-page">
      <div className="analysis-brand"><span className="brand-mark"><Scale size={20} /></span>NyayaSetu</div>
      <div className="scanner-wrap">
        <div className="scanner-document">
          <div className="scan-line" />
          <div className="scanner-heading" />
          <div className="scanner-lines"><span /><span /><span /><span /><span /><span /></div>
          <div className="scanner-stamp"><FileSearch /></div>
        </div>
      </div>
      <div className="analyzing-copy">
        <div className="section-kicker">ANALYSIS IN PROGRESS</div>
        <h1>Turning the letter<br />into a clear path.</h1>
        <div className="analysis-progress">
          {analysisSteps.map((step, index) => (
            <div className={index <= activeStep ? 'analysis-step active' : 'analysis-step'} key={step}>
              <span>{index < activeStep ? <Check size={14} /> : index + 1}</span>{step}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function ResultsScreen({
  analysis,
  activeTab,
  setActiveTab,
  onBack,
  onHome,
}: {
  analysis: CaseAnalysis
  activeTab: ResultTab
  setActiveTab: (tab: ResultTab) => void
  onBack: () => void
  onHome: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [sourceOpen, setSourceOpen] = useState<string | null>(null)

  const appealText = buildAppealText(analysis)

  async function copyAppeal() {
    await navigator.clipboard.writeText(appealText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="results-shell">
      <header className="results-header">
        <button className="brand" onClick={onHome}><span className="brand-mark"><Scale size={20} /></span><span>NyayaSetu</span></button>
        <div className="results-header-actions">
          <span className="case-id">Case {analysis.input.registrationNumber}</span>
          <button className="icon-button" onClick={() => window.print()} title="Print or save report"><Download size={18} /></button>
          <button className="secondary-button compact" onClick={onBack}>Analyze another</button>
        </div>
      </header>
      <div className="results-layout">
        <aside className="case-sidebar">
          <div className="sidebar-label">CASE FILE</div>
          <div className="case-file-icon"><FileText /></div>
          <h2>RTI response</h2>
          <p>{analysis.input.publicAuthority}</p>
          <dl className="case-meta">
            <div><dt>Received</dt><dd>{formatDate(analysis.input.receivedDate)}</dd></div>
            <div><dt>Application</dt><dd>{formatDate(analysis.input.applicationDate)}</dd></div>
            <div><dt>Pages read</dt><dd>1</dd></div>
          </dl>
          <div className="local-badge"><LockKeyhole size={15} /><span><strong>Privacy split</strong>Image OCR is local; confirmed text powers AI analysis</span></div>
          <button className="back-link sidebar-back" onClick={onBack}><ArrowLeft size={16} /> Analyze another response</button>
        </aside>
        <main className="results-main">
          <div className="result-topbar">
            <nav className="result-tabs" aria-label="Analysis sections">
              <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={activeTab === 'evidence' ? 'active' : ''} onClick={() => setActiveTab('evidence')}>Reasoning ledger</button>
              <button className={activeTab === 'appeal' ? 'active' : ''} onClick={() => setActiveTab('appeal')}>Appeal packet</button>
            </nav>
            <div className="language-chip"><Languages size={16} /> English <ChevronDown size={14} /></div>
          </div>

          {activeTab === 'overview' && (
            <Overview analysis={analysis} onOpenSource={setSourceOpen} onAppeal={() => setActiveTab('appeal')} />
          )}
          {activeTab === 'evidence' && <Evidence analysis={analysis} onOpenSource={setSourceOpen} />}
          {activeTab === 'appeal' && (
            <AppealPacket
              analysis={analysis}
              appealText={appealText}
              copied={copied}
              onCopy={() => void copyAppeal()}
            />
          )}
        </main>
      </div>
      {sourceOpen && <SourceDrawer sourceId={sourceOpen} onClose={() => setSourceOpen(null)} />}
    </div>
  )
}

function Overview({
  analysis,
  onOpenSource,
  onAppeal,
}: {
  analysis: CaseAnalysis
  onOpenSource: (id: string) => void
  onAppeal: () => void
}) {
  return (
    <div className="result-content">
      <section className="result-hero">
        <div>
          <div className="status-pill"><CheckCircle2 size={15} /> Analysis complete</div>
          <h1>There is still time<br />to take the next step.</h1>
          <p>{analysis.summary}</p>
        </div>
        <div className="deadline-card">
          <small>CALCULATED APPEAL TARGET</small>
          <strong>{formatDate(analysis.appealDueDate)}</strong>
          <span><Clock3 size={15} /> {Math.max(0, analysis.daysUntilAppealDue)} days remaining</span>
          <button onClick={() => onOpenSource('rti-19-1')}>See rule & calculation <ArrowRight size={14} /></button>
        </div>
      </section>

      {analysis.ai && <AiInsightPanel analysis={analysis.ai} />}

      <section className="result-section">
        <div className="result-section-heading">
          <div><span className="result-index">01</span><div><h2>What we found</h2><p>Facts extracted directly from the response</p></div></div>
          <span className="confidence-key"><span /> Verified or high confidence</span>
        </div>
        <div className="facts-grid">
          {analysis.facts.map((fact) => (
            <article className="fact-card" key={fact.label}>
              <small>{fact.label}</small>
              <strong>{fact.value}</strong>
              <span className={`fact-confidence ${fact.confidence}`}><CheckCircle2 size={13} />{fact.evidence}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="result-section">
        <div className="result-section-heading">
          <div><span className="result-index">02</span><div><h2>Issues worth raising</h2><p>Procedural checks, not predictions about your appeal</p></div></div>
        </div>
        <div className="finding-list">
          {analysis.findings.map((finding) => {
            const source = getSource(finding.sourceId)
            return (
              <article className={`finding-card ${finding.tone}`} key={finding.id}>
                <div className="finding-icon">{finding.tone === 'warning' ? <CircleAlert /> : <Info />}</div>
                <div><h3>{finding.title}</h3><p>{finding.detail}</p>
                  <button onClick={() => onOpenSource(finding.sourceId)}><BookOpen size={14} /> {source?.shortLabel}</button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="result-section">
        <div className="result-section-heading">
          <div><span className="result-index">03</span><div><h2>Your timeline</h2><p>Calculated with calendar days and visible inputs</p></div></div>
        </div>
        <div className="timeline">
          {analysis.timeline.map((event, index) => (
            <div className={`timeline-item ${event.state}`} key={event.label}>
              <div className="timeline-track"><span>{index < 2 ? <Check size={13} /> : index + 1}</span></div>
              <div><small>{event.label}</small><strong>{event.date}</strong><p>{event.detail}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="next-step-card">
        <div className="next-step-number">04</div>
        <div><small>RECOMMENDED NEXT STEP</small><h2>Prepare a first appeal</h2><p>We have converted the verified findings into a careful, editable appeal outline.</p></div>
        <button className="light-button" onClick={onAppeal}>Review appeal packet <ArrowRight size={17} /></button>
      </section>
    </div>
  )
}

function AiInsightPanel({ analysis }: { analysis: NonNullable<CaseAnalysis['ai']> }) {
  const available = analysis.mode !== 'unavailable'

  return (
    <section className={`ai-insight-panel ${analysis.mode}`}>
      <div className="ai-panel-heading">
        <div className="ai-orb"><BrainCircuit /></div>
        <div>
          <div className="ai-label">
            AI INTERPRETATION
            <span>{analysis.mode === 'live' ? 'Live' : analysis.mode === 'cached' ? 'Prepared sample' : 'Fallback'}</span>
          </div>
          <h2>{available ? 'What the response means in plain language' : 'AI layer unavailable'}</h2>
        </div>
      </div>
      <p className="ai-summary">{analysis.plainLanguageSummary}</p>
      {available && (
        <div className="ai-columns">
          <div>
            <h3><CircleAlert size={16} /> Issues the AI noticed</h3>
            <ul>{analysis.keyIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
          </div>
          <div>
            <h3><MessageCircleQuestion size={16} /> Questions to raise</h3>
            <ul>{analysis.questionsToRaise.map((question) => <li key={question}>{question}</li>)}</ul>
          </div>
        </div>
      )}
      {analysis.uncertainties.length > 0 && (
        <div className="ai-uncertainty"><ShieldCheck size={16} /><span><strong>Uncertainty disclosed:</strong> {analysis.uncertainties.join(' ')}</span></div>
      )}
      <p className="ai-safety-note">{analysis.safetyNote}</p>
    </section>
  )
}

function Evidence({ analysis, onOpenSource }: { analysis: CaseAnalysis; onOpenSource: (id: string) => void }) {
  return (
    <div className="result-content evidence-view">
      <div className="page-title-block">
        <div className="section-kicker">AUDIT TRAIL</div>
        <h1>See exactly how<br />we reached the date.</h1>
        <p>AI-generated prose cannot change this chain. Each step is grounded in a document fact, curated rule, or deterministic calculation.</p>
      </div>
      <div className="reasoning-chain">
        {analysis.reasoning.map((step, index) => (
          <article className={`reasoning-card ${step.kind}`} key={step.label}>
            <div className="reasoning-number">{String(index + 1).padStart(2, '0')}</div>
            <div><small>{step.label}</small><h2>{step.value}</h2>
              {step.sourceId && <button onClick={() => onOpenSource(step.sourceId!)}><BookOpen size={15} /> Open official source</button>}
            </div>
            <span className="reasoning-kind">{step.kind}</span>
          </article>
        ))}
      </div>
      <div className="limits-card">
        <ShieldCheck />
        <div><h3>What this analysis does not decide</h3><p>It does not determine whether the cited exemption is legally valid, predict the result of an appeal, or replace advice from a qualified professional. Confirm all extracted dates before filing.</p></div>
      </div>
    </div>
  )
}

function AppealPacket({
  analysis,
  appealText,
  copied,
  onCopy,
}: {
  analysis: CaseAnalysis
  appealText: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="result-content appeal-view">
      <div className="appeal-heading">
        <div className="page-title-block">
          <div className="section-kicker">EDIT BEFORE FILING</div>
          <h1>Your first-appeal<br />working packet.</h1>
          <p>This draft uses only the findings shown in the analysis. Add the First Appellate Authority's details and verify every date.</p>
        </div>
        <div className="appeal-actions">
          <button className="secondary-button" onClick={onCopy}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Copied' : 'Copy draft'}</button>
          <button className="primary-button" onClick={() => window.print()}><Download size={17} /> Save as PDF</button>
        </div>
      </div>
      <div className="appeal-layout">
        <article className="appeal-paper">
          <div className="appeal-paper-label">DRAFT FOR REVIEW</div>
          <pre>{appealText}</pre>
        </article>
        <aside className="packet-sidebar">
          <section>
            <h3><ClipboardCheck size={18} /> Before you file</h3>
            {analysis.evidenceChecklist.map((item) => <label key={item}><input type="checkbox" /> <span>{item}</span></label>)}
          </section>
          <section className="filing-note">
            <h3><ExternalLink size={18} /> Central portal</h3>
            <p>Use the original registration number. The official portal says no fee is payable for a first appeal.</p>
            <a href="https://rtionline.gov.in/" target="_blank" rel="noreferrer">Open RTI Online <ArrowRight size={15} /></a>
          </section>
          <section className="review-note">
            <CircleAlert size={18} />
            <p>Do not file this draft unchanged. Confirm the authority, receipt date, requested relief, and attachments.</p>
          </section>
        </aside>
      </div>
    </div>
  )
}

function SourceDrawer({ sourceId, onClose }: { sourceId: string; onClose: () => void }) {
  const source = getSource(sourceId)
  if (!source) return null

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="source-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close source"><X /></button>
        <div className="source-icon"><BookOpen /></div>
        <div className="section-kicker">OFFICIAL SOURCE</div>
        <h2>{source.shortLabel}</h2>
        <p className="source-authority">{source.authority}</p>
        <blockquote><Quote size={23} />{source.quote}</blockquote>
        <div className="source-meta"><span>Source checked</span><strong>{source.checkedOn}</strong></div>
        <a className="primary-button" href={source.url} target="_blank" rel="noreferrer">Open official document <ExternalLink size={17} /></a>
        <p className="source-caveat">Quoted text may be shortened for readability. Always review the official document before filing.</p>
      </aside>
    </div>
  )
}

function buildAppealText(analysis: CaseAnalysis) {
  return `To,
The First Appellate Authority
[Name of Public Authority]
[Address]

Subject: First appeal under Section 19(1) of the Right to Information Act, 2005

Reference: RTI application ${analysis.input.registrationNumber}

Respected Sir/Madam,

I prefer this first appeal in relation to my RTI application dated ${formatDate(analysis.input.applicationDate)} and the response received on ${formatDate(analysis.input.receivedDate)}.

GROUNDS FOR APPEAL

${analysis.appealGrounds.map((ground, index) => `${index + 1}. ${ground}`).join('\n\n')}

RELIEF REQUESTED

1. Kindly reconsider the response and provide a reasoned, point-wise decision on the information requested.

2. If any part of a record is exempt, kindly provide the non-exempt portion and identify the specific basis relied upon for each withheld part.

3. Kindly provide any other relief considered appropriate under the RTI Act, 2005.

Enclosures:
1. Copy of the original RTI application
2. Copy of the response received
3. Proof of receipt and other supporting documents

Date: [Insert filing date]
Place: [Insert place]

Signature: ____________________
Name: ${analysis.input.applicantName}

REVIEW NOTE: This is an editable working draft, not legal advice. Confirm the correct First Appellate Authority, dates, grounds, relief, and enclosures before filing.`
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="brand"><span className="brand-mark"><Scale size={19} /></span><span>NyayaSetu</span></div>
      <p>An explainable civic-tech prototype for LexHack 2026.</p>
      <span>Not legal advice.</span>
    </footer>
  )
}

export default App
