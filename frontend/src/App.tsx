import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Wallet, ArrowRight, UploadCloud, CircleDollarSign } from 'lucide-react'
import { useMemo, useState } from 'react'

const defaultForm = {
  claimant_name: 'Aisha Morgan',
  claimant_wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  policy_number: 'POL-2048-1',
  claim_type: 'Hospitalization',
  amount: '2400',
  incident_date: '2026-09-12',
  diagnosis: 'Acute lower back strain',
  notes: 'Post-surgical recovery and medication follow-up.',
}

const statusSteps = [
  { label: 'Submitted', current: false },
  { label: 'Verified', current: true },
  { label: 'Settlement', current: false },
  { label: 'Proof', current: false },
]

function App() {
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletConnected] = useState(true)

  const summary = useMemo(() => {
    if (!result) return null
    return {
      status: result.status,
      risk: result.risk_score,
      confidence: result.confidence,
      verdict: result.verdict,
      tx: result.blockchain_tx,
    }
  }, [result])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitClaim = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    const demoResult = {
      claim_id: 'MED-2048',
      status: 'approved',
      risk_score: 32,
      confidence: 96,
      verdict: 'approved',
      blockchain_tx: '0x8fc7c8e3b2f8f2118b1c5d7a2d6fc5326d2ff0af',
      payment_proof: { network: 'Sepolia demo', tx_hash: '0x8fc7c8e3b2f8f2118b1c5d7a2d6fc5326d2ff0af' },
      fraud_flags: ['No material risk flags'],
      summary: 'Medical records, diagnosis, and policy coverage align. The claim passed AI review and is ready for settled payout.',
    }

    setResult(demoResult)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-glow">
              <ShieldCheck className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-teal-300">MediVerify AI</p>
              <h1 className="text-lg font-semibold text-white">Claims verification</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Sepolia • Active
            </span>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-100">
              <Wallet className="h-4 w-4 text-teal-300" />
              {walletConnected ? '0x742d...44e' : 'Connect wallet'}
            </button>
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-teal-300">AI health insurance</p>
                  <h2 className="mt-2 text-4xl font-bold text-white">Verify claims in minutes.</h2>
                </div>
                <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-teal-200">Approval</p>
                  <p className="text-2xl font-bold text-teal-300">96%</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: 'OCR extraction', value: '98.7%' },
                  { label: 'Fraud detection', value: '94.2%' },
                  { label: 'Settlement speed', value: '2.4 min' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <form onSubmit={submitClaim} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-teal-300">Claim intake</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Submit medical claim</h3>
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-dashed border-teal-400/40 px-3 py-2 text-sm text-teal-200">
                  <UploadCloud className="h-4 w-4" />
                  Upload files
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Claimant name</span>
                  <input name="claimant_name" value={form.claimant_name} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-teal-400" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Wallet</span>
                  <input name="claimant_wallet" value={form.claimant_wallet} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-teal-400" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Policy number</span>
                  <input name="policy_number" value={form.policy_number} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-teal-400" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Claim type</span>
                  <select name="claim_type" value={form.claim_type} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-teal-400">
                    <option>Hospitalization</option>
                    <option>Surgery</option>
                    <option>Emergency</option>
                    <option>Dental</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Amount</span>
                  <input name="amount" value={form.amount} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-teal-400" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Incident date</span>
                  <input name="incident_date" type="date" value={form.incident_date} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-teal-400" />
                </label>
                <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                  <span>Diagnosis</span>
                  <input name="diagnosis" value={form.diagnosis} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-teal-400" />
                </label>
                <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                  <span>Notes</span>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-teal-400" />
                </label>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-400">Demo mode enabled • No API keys required</div>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 px-5 py-3 font-semibold text-slate-950 shadow-glow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? 'Reviewing claim...' : 'Verify claim'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-teal-300">Lifecycle</p>
              <div className="mt-5 space-y-4">
                {statusSteps.map((step, index) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${index === 1 ? 'border-teal-400 bg-teal-400/20 text-teal-300' : 'border-slate-600 bg-slate-800 text-slate-400'}`}>
                      {index === 1 ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-200 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Status</p>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                  {summary?.status ?? 'Awaiting review'}
                </span>
              </div>

              {result ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Risk score</p>
                      <p className="mt-1 text-2xl font-bold text-white">{result.risk_score}/100</p>
                    </div>
                    <div className="h-12 w-12 rounded-full border-4 border-emerald-400/50 border-t-transparent" />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Fraud flags</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {result.fraud_flags.map((flag: string) => (
                        <li key={flag}>• {flag}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Blockchain proof</p>
                    <p className="mt-2 break-all text-sm text-teal-300">{result.blockchain_tx}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                      <CircleDollarSign className="h-4 w-4 text-emerald-300" />
                      Settlement ready: $2,400.00
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-800/60 p-5 text-sm text-slate-400">
                  Submit a claim to generate the AI fraud assessment, blockchain verification, and settlement proof.
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
