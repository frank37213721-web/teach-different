/* ──────────────────────────────────────────────────────────────
   AuthModal — 登入 / 註冊 overlay
   設計風格與主站一致：紙米白、深墨、琥珀點綴
   ────────────────────────────────────────────────────────────── */
import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase.js";
import { Icon, CheckIcon, FlameIcon } from "./icons.jsx";

/* ── 小工具 icon（modal 內部用）── */
const EyeIcon = (p) => (
  <Icon {...p}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </Icon>
);
const EyeOffIcon = (p) => (
  <Icon {...p}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <path d="M2 2l20 20"/>
  </Icon>
);
const GoogleIcon = (p) => (
  <Icon {...p} strokeWidth={0}>
    <path fill="#4285F4" d="M21.8 10.2H12v3.8h5.6c-.5 2.5-2.7 4-5.6 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.8.6 3.8 1.5l2.8-2.8C17 3 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 10-4 10-10 0-.6-.1-1.2-.2-1.8z"/>
    <path fill="#34A853" d="M5.5 14.4l-3.2 2.5C3.9 19.4 7.7 22 12 22c3.1 0 5.7-1 7.6-2.7l-3.1-2.5c-1 .7-2.2 1.2-3.5 1.2-2.7 0-5-1.8-5.8-4.3-.1.2-.1.4-.2.7z"/>
    <path fill="#FBBC05" d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.6 2 12 2 7.7 2 4 4.6 2.3 8.1l3.2 2.5C6.3 7.5 8.9 5.5 12 5.5z"/>
    <path fill="#EA4335" d="M2 12c0-1.3.3-2.6.7-3.8L-.5 5.7C.9 3 2 6.5 2 12z" opacity="0"/>
    <path fill="#EA4335" d="M2.3 8.1L5.5 10.6C6.3 7.5 8.9 5.5 12 5.5V2C7.7 2 4 4.6 2.3 8.1z"/>
  </Icon>
);

/* ── 校對函式 ── */
const isEduEmail = (email) => /\.edu\.tw$/i.test(email.trim());
const isStrongPwd = (pwd) => pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);

const SUBJECTS = ["國語", "數學", "自然", "社會", "音樂", "美術", "英語", "體育", "綜合", "物理", "化學", "生物", "地理", "歷史", "公民", "資訊"];
const LEVELS = ["國小", "國中", "高中"];

/* ────────────────────────────────────────────────────────────── */
export default function AuthModal({ mode: initMode, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState(initMode || "login"); // login | signup | sent | complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* login fields */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  /* signup fields */
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPwd, setSignupPwd] = useState("");
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("國語");
  const [otherSubjects, setOtherSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [sentEmail, setSentEmail] = useState("");

  /* complete-profile fields (Google user) */
  const [cpSchool, setCpSchool] = useState("");
  const [cpSubject, setCpSubject] = useState("國語");
  const [cpLevels, setCpLevels] = useState([]);
  const [session, setSession] = useState(null);

  const overlayRef = useRef(null);

  /* Google OAuth callback → show complete profile */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s && mode === "complete") setSession(s);
    });
  }, [mode]);

  /* close on ESC */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function clickOverlay(e) {
    if (e.target === overlayRef.current) onClose();
  }

  /* ── 登入 ── */
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!isEduEmail(loginEmail)) {
      setError("請使用 .edu.tw 教育信箱登入");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPwd,
    });
    setLoading(false);
    if (err) { setError("帳號或密碼不正確，請再試一次"); return; }
    onAuthSuccess?.();
    onClose();
  }

  /* ── 註冊 ── */
  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("請填寫姓名"); return; }
    if (!isEduEmail(signupEmail)) { setError("請使用 .edu.tw 教育信箱（如 xxx@tp.edu.tw）"); return; }
    if (!isStrongPwd(signupPwd)) { setError("密碼需至少 8 碼、含大寫英文字母與數字"); return; }
    if (!school.trim()) { setError("請填寫任教學校"); return; }
    if (levels.length === 0) { setError("請至少選擇一個教育階段"); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPwd,
      options: {
        data: {
          full_name: name.trim(),
          school: school.trim(),
          primary_subject: subject,
          other_subjects: otherSubjects,
          education_levels: levels,
        },
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSentEmail(signupEmail.trim());
    setMode("sent");
  }

  /* ── Google OAuth ── */
  async function handleGoogle() {
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (err) setError(err.message);
  }

  /* ── 完成個人資料（Google 用戶）── */
  async function handleCompleteProfile(e) {
    e.preventDefault();
    setError("");
    if (!cpSchool.trim()) { setError("請填寫任教學校"); return; }
    if (cpLevels.length === 0) { setError("請至少選擇一個教育階段"); return; }
    if (!session) { setError("找不到登入資訊，請重新整理"); return; }

    setLoading(true);
    const { error: err } = await supabase.from("profiles").upsert({
      id: session.user.id,
      full_name: session.user.user_metadata?.full_name || "",
      avatar_url: session.user.user_metadata?.avatar_url || null,
      school: cpSchool.trim(),
      primary_subject: cpSubject,
      other_subjects: [],
      education_levels: cpLevels,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onAuthSuccess?.();
    onClose();
  }

  /* ── 其他科目 tag toggle ── */
  function toggleOtherSubject(s) {
    if (s === subject) return;
    setOtherSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }
  function toggleLevel(l) {
    setLevels((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  }
  function toggleCpLevel(l) {
    setCpLevels((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  }

  /* ── 密碼強度提示 ── */
  function PwdHint({ pwd }) {
    if (!pwd) return null;
    const len = pwd.length >= 8;
    const upper = /[A-Z]/.test(pwd);
    const num = /[0-9]/.test(pwd);
    if (len && upper && num) return null;
    return (
      <div className="mt-1.5 flex items-center gap-3 text-[11px] font-mono">
        <span className={len ? "text-[#2A9D8F]" : "text-[#C5C5BE]"}>8碼以上</span>
        <span className={upper ? "text-[#2A9D8F]" : "text-[#C5C5BE]"}>大寫英文</span>
        <span className={num ? "text-[#2A9D8F]" : "text-[#C5C5BE]"}>數字</span>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      onClick={clickOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(24,24,27,0.45)", backdropFilter: "blur(6px)" }}
    >
      <div className="relative w-full max-w-[460px] bg-white rounded-2xl border border-[#ECECE6] shadow-[0_32px_80px_-20px_rgba(24,24,27,0.40)] overflow-hidden max-h-[92vh] overflow-y-auto">

        {/* paper grain */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(24,24,27,0.018) 1px, transparent 0)", backgroundSize: "4px 4px" }}
        ></div>

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center text-[#9C9C95] hover:bg-[#F2F2EC] hover:text-[#18181B] transition-colors"
        >
          <CloseIcon size={14}/>
        </button>

        <div className="relative p-8">

          {/* ── brand mark ── */}
          <div className="flex items-center gap-2 mb-7">
            <div className="relative w-7 h-7 rounded-md bg-[#18181B] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,180,80,0.55),transparent_60%)]"></div>
              <FlameIcon size={13} className="text-[#F5B450] relative" strokeWidth={1.6}/>
            </div>
            <span className="text-[14px] font-medium text-[#18181B] tracking-tight">
              Teach <span className="italic font-normal" style={{ fontFamily: "'Noto Serif TC',serif" }}>Different</span>
            </span>
          </div>

          {/* ══════════════ LOGIN ══════════════ */}
          {mode === "login" && (
            <>
              <div className="mb-6">
                <h2 className="text-[22px] font-medium tracking-tight text-[#18181B]">歡迎回來</h2>
                <p className="mt-1 text-[13px] text-[#7A7A74]">請使用教育信箱登入</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Field label="教育信箱">
                  <Input type="email" value={loginEmail} onChange={setLoginEmail} placeholder="name@school.edu.tw" autoFocus/>
                </Field>

                <Field label="密碼">
                  <div className="relative">
                    <Input
                      type={showLoginPwd ? "text" : "password"}
                      value={loginPwd}
                      onChange={setLoginPwd}
                      placeholder="輸入密碼"
                    />
                    <button type="button" onClick={() => setShowLoginPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9C95] hover:text-[#18181B]">
                      {showLoginPwd ? <EyeOffIcon size={14}/> : <EyeIcon size={14}/>}
                    </button>
                  </div>
                </Field>

                {error && <p className="text-[12px] text-[#E76F51]">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#18181B] text-white text-[13.5px] font-medium hover:bg-[#2A2A2E] transition-colors disabled:opacity-60 mt-2">
                  {loading ? "登入中..." : "登入"}
                </button>
              </form>

              <Divider/>
              <GoogleButton onClick={handleGoogle}/>

              <p className="mt-6 text-center text-[12.5px] text-[#7A7A74]">
                還沒有帳號？{" "}
                <button onClick={() => { setMode("signup"); setError(""); }}
                  className="text-[#18181B] font-medium hover:underline underline-offset-2">
                  免費註冊
                </button>
              </p>
            </>
          )}

          {/* ══════════════ SIGNUP ══════════════ */}
          {mode === "signup" && (
            <>
              <div className="mb-6">
                <h2 className="text-[22px] font-medium tracking-tight text-[#18181B]">加入教師社群</h2>
                <p className="mt-1 text-[13px] text-[#7A7A74]">需要 .edu.tw 教育信箱才能加入</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <Field label="姓名">
                  <Input value={name} onChange={setName} placeholder="王大明" autoFocus/>
                </Field>

                <Field label="教育信箱">
                  <Input type="email" value={signupEmail} onChange={setSignupEmail} placeholder="name@school.edu.tw"/>
                  {signupEmail && !isEduEmail(signupEmail) && (
                    <p className="mt-1 text-[11px] text-[#E89B3C]">需要 .edu.tw 結尾的教育信箱</p>
                  )}
                </Field>

                <Field label="密碼">
                  <div className="relative">
                    <Input
                      type={showSignupPwd ? "text" : "password"}
                      value={signupPwd}
                      onChange={setSignupPwd}
                      placeholder="至少 8 碼，含大寫與數字"
                    />
                    <button type="button" onClick={() => setShowSignupPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9C95] hover:text-[#18181B]">
                      {showSignupPwd ? <EyeOffIcon size={14}/> : <EyeIcon size={14}/>}
                    </button>
                  </div>
                  <PwdHint pwd={signupPwd}/>
                </Field>

                <Field label="任教學校">
                  <Input value={school} onChange={setSchool} placeholder="如：民和國小、師大附中"/>
                </Field>

                <Field label="主要任教科目">
                  <div className="relative">
                    <select
                      value={subject}
                      onChange={(e) => { setSubject(e.target.value); setOtherSubjects(prev => prev.filter(s => s !== e.target.value)); }}
                      className="w-full h-10 rounded-lg border border-[#ECECE6] bg-white px-3 text-[13px] text-[#18181B] appearance-none focus:outline-none focus:border-[#18181B]/30 transition-colors"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9C9C95]">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                </Field>

                <Field label="其他任教科目（選填）">
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.filter(s => s !== subject).map(s => {
                      const on = otherSubjects.includes(s);
                      return (
                        <button type="button" key={s} onClick={() => toggleOtherSubject(s)}
                          className={`h-7 px-2.5 rounded-full text-[11.5px] border transition-all ${
                            on ? "bg-[#18181B] text-white border-[#18181B]" : "border-[#ECECE6] text-[#5C5C58] hover:border-[#18181B]/30"
                          }`}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label="教育階段">
                  <div className="flex items-center gap-2">
                    {LEVELS.map(l => {
                      const on = levels.includes(l);
                      return (
                        <button type="button" key={l} onClick={() => toggleLevel(l)}
                          className={`flex-1 h-9 rounded-lg border text-[13px] font-medium transition-all ${
                            on ? "bg-[#18181B] text-white border-[#18181B]" : "border-[#ECECE6] text-[#5C5C58] hover:border-[#18181B]/30"
                          }`}>
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {error && <p className="text-[12px] text-[#E76F51]">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#18181B] text-white text-[13.5px] font-medium hover:bg-[#2A2A2E] transition-colors disabled:opacity-60 mt-2">
                  {loading ? "建立中..." : "建立帳號"}
                </button>
              </form>

              <Divider/>
              <GoogleButton onClick={handleGoogle}/>

              <p className="mt-6 text-center text-[12.5px] text-[#7A7A74]">
                已有帳號？{" "}
                <button onClick={() => { setMode("login"); setError(""); }}
                  className="text-[#18181B] font-medium hover:underline underline-offset-2">
                  登入
                </button>
              </p>
            </>
          )}

          {/* ══════════════ SENT ══════════════ */}
          {mode === "sent" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#E5F1EE] flex items-center justify-center mx-auto mb-5">
                <CheckIcon size={22} className="text-[#2A9D8F]" strokeWidth={2}/>
              </div>
              <h2 className="text-[20px] font-medium tracking-tight text-[#18181B]">確認信已寄出</h2>
              <p className="mt-3 text-[13px] text-[#7A7A74] leading-[1.65]">
                我們已寄送確認連結到<br/>
                <span className="text-[#18181B] font-medium font-mono">{sentEmail}</span>
              </p>
              <p className="mt-3 text-[12px] text-[#9C9C95] leading-[1.6]">
                點擊信中的連結後即可開始使用。<br/>如未收到，請檢查垃圾郵件資料夾。
              </p>
              <button
                onClick={() => { setMode("signup"); setError(""); setSentEmail(""); }}
                className="mt-6 text-[12.5px] text-[#7A7A74] hover:text-[#18181B] transition-colors"
              >
                ← 重新填寫
              </button>
            </div>
          )}

          {/* ══════════════ COMPLETE PROFILE ══════════════ */}
          {mode === "complete" && (
            <>
              <div className="mb-6">
                <h2 className="text-[22px] font-medium tracking-tight text-[#18181B]">完善個人資料</h2>
                <p className="mt-1 text-[13px] text-[#7A7A74]">讓其他老師更了解你</p>
              </div>

              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <Field label="任教學校">
                  <Input value={cpSchool} onChange={setCpSchool} placeholder="如：民和國小、師大附中" autoFocus/>
                </Field>

                <Field label="主要任教科目">
                  <div className="relative">
                    <select
                      value={cpSubject}
                      onChange={(e) => setCpSubject(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#ECECE6] bg-white px-3 text-[13px] text-[#18181B] appearance-none focus:outline-none focus:border-[#18181B]/30 transition-colors"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9C9C95]">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                </Field>

                <Field label="教育階段">
                  <div className="flex items-center gap-2">
                    {LEVELS.map(l => {
                      const on = cpLevels.includes(l);
                      return (
                        <button type="button" key={l} onClick={() => toggleCpLevel(l)}
                          className={`flex-1 h-9 rounded-lg border text-[13px] font-medium transition-all ${
                            on ? "bg-[#18181B] text-white border-[#18181B]" : "border-[#ECECE6] text-[#5C5C58] hover:border-[#18181B]/30"
                          }`}>
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {error && <p className="text-[12px] text-[#E76F51]">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#18181B] text-white text-[13.5px] font-medium hover:bg-[#2A2A2E] transition-colors disabled:opacity-60 mt-2">
                  {loading ? "儲存中..." : "完成設定"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* ── shared sub-components ── */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-mono tracking-[0.16em] uppercase text-[#9C9C95] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ type = "text", value, onChange, placeholder, autoFocus }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full h-10 rounded-lg border border-[#ECECE6] bg-white px-3 text-[13px] text-[#18181B] placeholder:text-[#C5C5BE] focus:outline-none focus:border-[#18181B]/30 transition-colors"
    />
  );
}

function Divider() {
  return (
    <div className="relative my-5 flex items-center">
      <div className="flex-1 border-t border-[#ECECE6]"></div>
      <span className="mx-3 text-[11px] text-[#C5C5BE] font-mono">或</span>
      <div className="flex-1 border-t border-[#ECECE6]"></div>
    </div>
  );
}

function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-10 rounded-lg border border-[#ECECE6] bg-white flex items-center justify-center gap-2.5 text-[13px] text-[#18181B] hover:bg-[#FAFAF5] hover:border-[#D6D6CE] transition-colors"
    >
      <GoogleIcon size={16}/>
      以 Google 教育帳號繼續
    </button>
  );
}

/* 小叉叉 icon（使用 inline 避免命名衝突）*/
function CloseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}
