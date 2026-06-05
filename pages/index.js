import { useState } from "react";
import Head from "next/head";

const QUESTIONS = [
  {
    id: "vibe",
    question: "What vibe do you want to give off?",
    options: ["Effortless & Cool", "Polished & Put-together", "Bold & Expressive", "Cozy & Relaxed", "Edgy & Avant-garde"],
  },
  {
    id: "body",
    question: "How would you describe your body type?",
    options: ["Slim / Lean", "Athletic / Muscular", "Average / Medium", "Curvy / Full", "Tall / Long-limbed"],
  },
  {
    id: "budget",
    question: "What's your usual clothing budget per item?",
    options: ["Under $20", "$20–$50", "$50–$100", "$100–$200", "$200+"],
  },
  {
    id: "avoid",
    question: "What do you never want to wear?",
    options: ["Bright colors", "Baggy fits", "Tight/fitted", "Patterns", "Formal anything"],
  },
  {
    id: "hair",
    question: "What's your hair situation?",
    options: ["Short & low-maintenance", "Medium length", "Long hair", "Natural / Curly / Coily", "Bald / Buzzed"],
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentQ = QUESTIONS[step - 1];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      fetchAdvice(newAnswers);
    }
  };

  const fetchAdvice = async (finalAnswers) => {
    setStep(6);
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult("");
    setError("");
  };

  const formatResult = (text) => {
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={i} />;
      if (trimmed.match(/^\d+\.\s+[A-Z\s]+:/)) {
        return <h3 key={i} className="section-header">{trimmed}</h3>;
      }
      if (trimmed.startsWith("- ")) {
        return <li key={i} className="result-li">{trimmed.slice(2)}</li>;
      }
      return <p key={i} className="result-p">{trimmed}</p>;
    });
  };

  return (
    <>
      <Head>
        <title>Style Advisor — Find Your Signature Look</title>
        <meta name="description" content="AI-powered personal style guide for outfits, colors, and hair." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        <div className="card">

          {step === 0 && (
            <>
              <div className="eyebrow">Personal Style Advisor</div>
              <h1 className="title">Find your <em>signature</em> style.</h1>
              <p className="subtitle">Answer 5 quick questions and get a personalized style guide — outfits, colors, hair, and your unique aesthetic identity.</p>
              <button className="btn-primary" onClick={() => setStep(1)}>Start My Style Quiz →</button>
            </>
          )}

          {step >= 1 && step <= QUESTIONS.length && (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((step - 1) / QUESTIONS.length) * 100}%` }} />
              </div>
              <div className="step-label">{step} of {QUESTIONS.length}</div>
              <p className="question">{currentQ.question}</p>
              {currentQ.options.map((opt) => (
                <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
              ))}
            </>
          )}

          {step === 6 && (
            <>
              {loading && (
                <div className="loading">
                  <div className="spinner" />
                  <p className="loading-text">Analyzing your style DNA...</p>
                </div>
              )}
              {error && (
                <>
                  <div className="error-box">⚠ {error}</div>
                  <button className="btn-primary" onClick={() => fetchAdvice(answers)}>Try Again →</button>
                  <button className="btn-ghost" onClick={restart}>Start Over</button>
                </>
              )}
              {!loading && !error && result && (
                <>
                  <div className="eyebrow">Your Style Report</div>
                  <div className="divider" />
                  <div className="result-scroll">{formatResult(result)}</div>
                  <div className="divider" />
                  <button className="btn-primary" onClick={restart}>Retake Quiz →</button>
                </>
              )}
            </>
          )}
        </div>
        <p className="footer">Powered by Claude AI</p>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        .app { min-height: 100vh; background: #0a0a0f; background-image: radial-gradient(ellipse at 20% 20%, rgba(240,192,96,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(180,120,240,0.04) 0%, transparent 60%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 20px; font-family: 'DM Mono', monospace; }
        .card { width: 100%; max-width: 520px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; padding: 40px 36px; }
        .eyebrow { font-size: 10px; letter-spacing: 0.3em; color: #f0c060; text-transform: uppercase; margin-bottom: 12px; }
        .title { font-family: 'Playfair Display', serif; font-size: clamp(26px, 6vw, 38px); color: #f0f0f8; line-height: 1.15; margin-bottom: 16px; }
        .title em { font-style: italic; color: #f0c060; }
        .subtitle { font-size: 13px; color: #808090; line-height: 1.7; margin-bottom: 32px; }
        .btn-primary { background: #f0c060; color: #0a0a0f; border: none; padding: 14px 28px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; border-radius: 1px; transition: all 0.2s; width: 100%; }
        .btn-primary:hover { background: #f8d080; transform: translateY(-1px); }
        .progress-bar { width: 100%; height: 2px; background: rgba(255,255,255,0.06); margin-bottom: 32px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #f0c060, #d0a0e0); transition: width 0.4s ease; }
        .question { font-family: 'Playfair Display', serif; font-size: 22px; color: #f0f0f8; margin-bottom: 24px; line-height: 1.3; }
        .step-label { font-size: 10px; letter-spacing: 0.2em; color: #505060; margin-bottom: 20px; text-transform: uppercase; }
        .option-btn { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #b0b0c0; padding: 14px 18px; text-align: left; font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; border-radius: 1px; margin-bottom: 8px; transition: all 0.15s; letter-spacing: 0.05em; }
        .option-btn:hover { background: rgba(240,192,96,0.08); border-color: rgba(240,192,96,0.3); color: #f0c060; transform: translateX(4px); }
        .loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px 0; }
        .spinner { width: 32px; height: 32px; border: 2px solid rgba(240,192,96,0.15); border-top-color: #f0c060; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { color: #a0a0b0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; }
        .result-scroll { max-height: 420px; overflow-y: auto; padding-right: 8px; margin-bottom: 24px; }
        .result-scroll::-webkit-scrollbar { width: 3px; }
        .result-scroll::-webkit-scrollbar-thumb { background: rgba(240,192,96,0.3); border-radius: 2px; }
        .section-header { color: #f0c060; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 22px; margin-bottom: 6px; font-family: 'DM Mono', monospace; font-weight: 500; }
        .result-li { color: #c8c8d8; line-height: 1.8; margin-left: 16px; font-size: 13px; }
        .result-p { color: #c8c8d8; line-height: 1.7; font-size: 13px; }
        .error-box { background: rgba(255,80,80,0.08); border: 1px solid rgba(255,80,80,0.2); padding: 12px 16px; border-radius: 1px; color: #ff8080; font-size: 12px; margin-bottom: 16px; line-height: 1.6; }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #606070; padding: 10px 20px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; border-radius: 1px; transition: all 0.2s; width: 100%; margin-top: 8px; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: #9090a0; }
        .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 24px 0; }
        .footer { margin-top: 20px; font-size: 10px; color: #303040; letter-spacing: 0.15em; text-transform: uppercase; }
      `}</style>
    </>
  );
}
