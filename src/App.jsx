import { useState, useEffect } from "react";
import ForkTreeView from "./ForkTree.jsx";
import ImpactDashboard from "./Dashboard.jsx";
import ComposeView from "./Compose.jsx";
import DiscoverHub from "./Discover.jsx";
import AuthModal from "./Register.jsx";
import { supabase } from "./lib/supabase.js";
import {
  FlameIcon,
  ForkIcon,
  SearchIcon,
  BellIcon,
  PlusIcon,
  ArrowLeftIcon,
  SendIcon,
  SparkleIcon,
  ChatIcon,
  ClockIcon,
  CommandIcon,
  CheckIcon,
  FeatherIcon,
} from "./icons.jsx";

/* ──────────────────────────────────────────────────────────────
   Sample data — teaching ideas wall
   ────────────────────────────────────────────────────────────── */
const IDEAS = [
  {
    id: "i01",
    subject: "國語",
    grade: "五年級",
    title: "用便利貼演化一篇作文",
    excerpt:
      "讓孩子先在牆上寫下一句話，下一位同學再用便利貼蓋掉並替換它。整堂課就是一篇文章的「修訂歷史」。",
    author: { name: "林宛庭", school: "民和國小", color: "linear-gradient(135deg,#E9C46A,#E76F51)" },
    forkedFrom: { name: "陳秀蓮", commit: "f3a91c" },
    lights: 142,
    practices: 38,
    daysAgo: 3,
  },
  {
    id: "i02",
    subject: "數學",
    grade: "六年級",
    title: "走廊地磚變身座標平面",
    excerpt:
      "把走廊當成一個 12×6 的卡式座標系。學生輪流當「點」，老師喊出座標，被點到的人要快速跑到位置。",
    author: { name: "黃子翔", school: "復興國小", color: "linear-gradient(135deg,#2A9D8F,#264653)" },
    forkedFrom: null,
    lights: 87,
    practices: 22,
    daysAgo: 5,
  },
  {
    id: "i03",
    subject: "自然",
    grade: "三年級",
    title: "下雨天的微氣象觀察",
    excerpt:
      "下雨那天臨時改成「雨滴觀察會」。一人發一張黑色紙片，伸出走廊，回來用放大鏡計算每平方公分的雨滴痕跡。",
    author: { name: "蔡佳穎", school: "明德國小", color: "linear-gradient(135deg,#A8DADC,#457B9D)" },
    forkedFrom: { name: "蔡佳穎", commit: "92cf04" },
    lights: 211,
    practices: 64,
    daysAgo: 1,
  },
  {
    id: "i04",
    subject: "社會",
    grade: "五年級",
    title: "讓學生當主播報歷史",
    excerpt:
      "把朝代興替包裝成晚間新聞。學生分組挑一個事件，準備 90 秒口播稿，用手機錄一段「歷史晚間新聞」。",
    author: { name: "周明哲", school: "南屏國中", color: "linear-gradient(135deg,#F4A261,#E76F51)" },
    forkedFrom: { name: "林宛庭", commit: "a01e7d" },
    lights: 96,
    practices: 19,
    daysAgo: 8,
  },
  {
    id: "i05",
    subject: "音樂",
    grade: "四年級",
    title: "節奏就是程式語言",
    excerpt:
      "用「ㄉㄤ／ㄎㄎ／休止」三個字寫一段 16 拍節奏譜，再讓另一組學生用身體動作「解析執行」。",
    author: { name: "葉若萱", school: "蓬萊國小", color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)" },
    forkedFrom: null,
    lights: 54,
    practices: 11,
    daysAgo: 12,
  },
  {
    id: "i06",
    subject: "綜合",
    grade: "六年級",
    title: "畢業前的「校園小事典」",
    excerpt:
      "請每位學生提名一件「只有我們這屆才懂」的小事，匿名投票後做成 A4 風格的辭典頁。送給下一屆。",
    author: { name: "鄭懷恩", school: "光復國小", color: "linear-gradient(135deg,#264653,#2A9D8F)" },
    forkedFrom: { name: "黃子翔", commit: "c47b21" },
    lights: 318,
    practices: 102,
    daysAgo: 14,
  },
  {
    id: "i07",
    subject: "物理",
    grade: "高中二年級",
    title: "用果凍捏出 PN 接面",
    excerpt:
      "兩色果凍分別代表 N 型與 P 型半導體，學生用手指把「多數載子」往中間推，直到推不動的那條線，就是空乏區。比投影片直觀十倍。",
    author: { name: "吳承翰", school: "建國高中", color: "linear-gradient(135deg,#0077B6,#023E8A)" },
    forkedFrom: null,
    lights: 74,
    practices: 21,
    daysAgo: 2,
  },
  {
    id: "i08",
    subject: "物理",
    grade: "高中一年級",
    title: "LED 光譜反推禁帶寬度",
    excerpt:
      "每組拿一片光柵片對著不同顏色 LED 觀察光譜，記錄峰值波長，換算光子能量。最後比對理論禁帶寬度，誤差在 5% 內的組別有小獎勵。",
    author: { name: "陳柏宇", school: "師大附中", color: "linear-gradient(135deg,#F77F00,#D62828)" },
    forkedFrom: { name: "吳承翰", commit: "e81d3f" },
    lights: 112,
    practices: 33,
    daysAgo: 6,
  },
  {
    id: "i09",
    subject: "化學",
    grade: "高中一年級",
    title: "從沙子到晶片：矽的鍵結旅行",
    excerpt:
      "帶一包海沙進教室。從 SiO₂ 的共價鍵出發，一步步走到純矽、摻雜、再到 N 型與 P 型。最後讓學生計算：這包沙能做幾顆晶片？",
    author: { name: "林雅涵", school: "北一女中", color: "linear-gradient(135deg,#40916C,#1B4332)" },
    forkedFrom: null,
    lights: 89,
    practices: 28,
    daysAgo: 9,
  },
  {
    id: "i10",
    subject: "自然科學",
    grade: "高中三年級",
    title: "製程節點縮放：人體比例尺",
    excerpt:
      "把一根頭髮（約 70µm）投影在黑板上，讓學生用尺算出 7nm 節點在上面有多細。再算一顆 M1 晶片裡 160 億顆電晶體排成一排有多長。數字讓人起雞皮疙瘩。",
    author: { name: "張智翔", school: "中山女高", color: "linear-gradient(135deg,#7B2D8B,#4A0E6E)" },
    forkedFrom: { name: "林雅涵", commit: "b52a9c" },
    lights: 156,
    practices: 47,
    daysAgo: 4,
  },
];

const HELP_CHIPS = [
  "拯救了我的備課之夜",
  "學生眼神都亮了",
  "比我原本的還好玩",
  "我也想試試看",
  "讓我重新愛上教書",
  "解了我卡住的單元",
];

/* ──────────────────────────────────────────────────────────────
   Top nav
   ────────────────────────────────────────────────────────────── */
function TopNav({ view, setView, onCompose, session, onLogin, onSignup, onLogout }) {
  const avatarChar = session
    ? (session.user?.user_metadata?.full_name?.[0] || session.user?.email?.[0] || "?").toUpperCase()
    : null;
  const avatarUrl = session?.user?.user_metadata?.avatar_url || null;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[rgba(250,250,247,0.72)] border-b border-[#ECECE6]">
      <div className="max-w-[1280px] mx-auto px-8 h-[60px] flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 rounded-md bg-[#18181B] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,180,80,0.55),transparent_60%)]"></div>
              <FlameIcon size={14} className="text-[#F5B450] relative" strokeWidth={1.6} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-medium text-[#18181B] tracking-tight">
                Teach <span className="italic font-normal" style={{ fontFamily: "'Noto Serif TC',serif" }}>Different</span>
              </div>
            </div>
          </a>
          <nav className="flex items-center gap-1 text-[13px]">
            {[
              ["wall", "點子牆"],
              ["impact", "我的影響力"],
              ["discover", "探索"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`px-3 h-7 rounded-md transition-colors ${
                  view === k
                    ? "bg-[#18181B]/[0.06] text-[#18181B]"
                    : "text-[#5C5C58] hover:text-[#18181B]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          <button className="h-8 px-2.5 rounded-md flex items-center gap-2 text-[12px] text-[#7A7A74] border border-[#ECECE6] hover:border-[#D9D9D2] hover:text-[#18181B] transition-colors">
            <SearchIcon size={13} />
            <span>搜尋點子</span>
            <span className="flex items-center gap-0.5 text-[10.5px] text-[#A8A8A2] border border-[#ECECE6] rounded px-1 py-px font-mono">
              <CommandIcon size={9} strokeWidth={2}/> K
            </span>
          </button>

          {session === undefined ? (
            /* loading — ghost placeholder */
            <div className="ml-1 w-8 h-8 rounded-full bg-[#ECECE6] animate-pulse" />
          ) : session ? (
            /* logged in */
            <>
              <button className="h-8 w-8 rounded-md flex items-center justify-center text-[#5C5C58] hover:bg-[#18181B]/[0.05] hover:text-[#18181B] transition-colors relative">
                <BellIcon size={15} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E76F51]"></span>
              </button>
              <button
                onClick={onCompose}
                className="h-8 px-3 rounded-md bg-[#18181B] text-white text-[12.5px] font-medium hover:bg-[#2A2A2E] transition-colors flex items-center gap-1.5"
              >
                <PlusIcon size={13} strokeWidth={2}/>
                分享點子
              </button>
              <button
                onClick={onLogout}
                title="登出"
                className="ml-1 w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#ECECE6] hover:ring-[#D9D9D2] transition-all"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[11px] font-medium text-white"
                    style={{ background: "linear-gradient(135deg,#264653,#2A9D8F)" }}>
                    {avatarChar}
                  </div>
                )}
              </button>
            </>
          ) : (
            /* logged out */
            <>
              <button
                onClick={onLogin}
                className="h-8 px-3 rounded-md text-[12.5px] text-[#5C5C58] hover:text-[#18181B] border border-[#ECECE6] hover:border-[#D9D9D2] transition-colors"
              >
                登入
              </button>
              <button
                onClick={onSignup}
                className="h-8 px-3.5 rounded-md bg-[#E89B3C] text-white text-[12.5px] font-medium hover:bg-[#F2AC55] transition-colors"
              >
                免費註冊
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────
   Header block (greeting)
   ────────────────────────────────────────────────────────────── */
function PageHeader({ ideasCount }) {
  return (
    <section className="max-w-[1280px] mx-auto px-8 pt-14 pb-10">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-[12px] text-[#7A7A74] mb-3 font-mono">
            <span className="w-1 h-1 rounded-full bg-[#E76F51] animate-pulse"></span>
            本週・第 38 週
          </div>
          <h1 className="text-[42px] leading-[1.05] tracking-tight text-[#18181B] font-medium">
            晚安，昀真老師。<br/>
            <span className="text-[#9C9C95]" style={{ fontFamily: "'Noto Serif TC',serif", fontStyle: "italic", fontWeight: 400 }}>
              今晚有 {ideasCount} 個來自其他教室的點子。
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-6 pb-2">
          <Stat label="點子分享" value="142" />
          <div className="w-px h-8 bg-[#ECECE6]"></div>
          <Stat label="收到的燈" value="2,418" />
          <div className="w-px h-8 bg-[#ECECE6]"></div>
          <Stat label="實踐回饋" value="396" />
        </div>
      </div>

      {/* filter bar */}
      <div className="mt-9 flex items-center justify-between border-b border-[#ECECE6] pb-3">
        <div className="flex items-center gap-1">
          {["全部點子", "我關注的科目", "本週熱燈", "尚未被實踐"].map((f, i) => (
            <button
              key={f}
              className={`px-3 h-8 text-[13px] rounded-md transition-colors ${
                i === 0 ? "text-[#18181B] bg-[#18181B]/[0.05]" : "text-[#7A7A74] hover:text-[#18181B]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#7A7A74]">
          <span>排序</span>
          <button className="text-[#18181B] hover:underline underline-offset-2">最近實踐</button>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-right">
      <div className="text-[20px] font-medium text-[#18181B] tracking-tight tabular-nums">{value}</div>
      <div className="text-[11px] text-[#7A7A74] mt-0.5">{label}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Card — front + flipped back (envelope)
   ────────────────────────────────────────────────────────────── */
function IdeaCard({ idea, flipped, onFlip, onClose, justLit, onOpenTree }) {
  return (
    <div className="card-perspective h-[420px]">
      <div
        className={`card-inner relative w-full h-full transition-transform duration-[780ms]`}
        style={{
          transformStyle: "preserve-3d",
          transitionTimingFunction: "cubic-bezier(0.7,0.05,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-xl bg-white border border-[#ECECE6] overflow-hidden group hover:border-[#D6D6CE] hover:-translate-y-[2px] hover:shadow-[0_18px_40px_-30px_rgba(24,24,27,0.35)] transition-all duration-300"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 flex flex-col p-6">
            {/* tags + time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium text-[#18181B] bg-[#F2F2EC] border border-[#ECECE6]">
                  {idea.subject}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] text-[#7A7A74] border border-[#ECECE6]">
                  {idea.grade}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#9C9C95] font-mono">
                <ClockIcon size={11}/>
                {idea.daysAgo}d
              </div>
            </div>

            {/* title */}
            <h3
              onClick={(e) => { e.stopPropagation(); onOpenTree && onOpenTree(); }}
              className="mt-5 text-[20px] leading-[1.3] font-medium text-[#18181B] tracking-tight cursor-pointer hover:underline underline-offset-2 decoration-[#D9D9D2]"
            >
              {idea.title}
            </h3>

            {/* excerpt */}
            <p className="mt-3 text-[13.5px] leading-[1.65] text-[#5C5C58] line-clamp-4">
              {idea.excerpt}
            </p>

            <div className="flex-1"></div>

            {/* fork badge */}
            {idea.forkedFrom && (
              <button
                onClick={(e) => { e.stopPropagation(); onOpenTree && onOpenTree(); }}
                className="flex items-center gap-1.5 mb-4 text-[11px] text-[#7A7A74] font-mono hover:text-[#18181B] transition-colors w-fit group/fork"
              >
                <ForkIcon size={11} className="text-[#9C9C95] group-hover/fork:text-[#E89B3C]" />
                <span>forked from</span>
                <span className="text-[#18181B]">{idea.forkedFrom.name}</span>
                <span className="text-[#C5C5BE]">·</span>
                <span className="text-[#9C9C95]">{idea.forkedFrom.commit}</span>
              </button>
            )}

            {/* footer: author + actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F0F0EA]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium text-white"
                  style={{ background: idea.author.color }}
                >
                  {idea.author.name[0]}
                </div>
                <div className="leading-tight">
                  <div className="text-[12.5px] text-[#18181B] font-medium">{idea.author.name}</div>
                  <div className="text-[10.5px] text-[#9C9C95]">{idea.author.school}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11.5px] text-[#7A7A74] font-mono tabular-nums">
                  <FlameIcon size={12} className="text-[#E89B3C]"/>
                  {idea.lights + (justLit ? 1 : 0)}
                </span>
                <span className="flex items-center gap-1 text-[11.5px] text-[#7A7A74] font-mono tabular-nums">
                  <ChatIcon size={11}/>
                  {idea.practices}
                </span>
              </div>
            </div>

            {/* The candle button — floats above the footer */}
            <button
              onClick={onFlip}
              className="absolute right-5 bottom-[78px] candle-btn flex items-center gap-1.5 pl-2.5 pr-3 h-8 rounded-full text-[12px] font-medium text-[#18181B] bg-white border border-[#E0DDD0] hover:border-[#C9B582] hover:bg-[#FFFBF0] hover:shadow-[0_8px_24px_-12px_rgba(232,155,60,0.55)] transition-all duration-300"
            >
              <span className="relative w-3.5 h-3.5">
                <FlameIcon size={13} className="text-[#E89B3C] candle-flame" strokeWidth={1.7}/>
              </span>
              <span>實踐並給他一盞燈</span>
            </button>
          </div>
        </div>

        {/* BACK — envelope */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background:
              "linear-gradient(160deg,#16171D 0%,#1A1B22 45%,#13141A 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* envelope subtle interior glow */}
          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full opacity-[0.18]"
            style={{ background: "radial-gradient(circle,#F5B450,transparent 65%)" }}></div>
          <div className="absolute -bottom-24 -left-12 w-60 h-60 rounded-full opacity-[0.10]"
            style={{ background: "radial-gradient(circle,#E76F51,transparent 65%)" }}></div>

          {/* envelope inner stitch */}
          <div className="absolute inset-3 rounded-lg border border-dashed border-white/[0.06] pointer-events-none"></div>

          <div className="relative h-full flex flex-col p-6 text-[#EFE9DA]">
            {/* header */}
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-[11.5px] text-[#9A968A] hover:text-[#EFE9DA] transition-colors"
              >
                <ArrowLeftIcon size={13}/>
                回到點子
              </button>
              <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-[#9A968A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E89B3C] shadow-[0_0_8px_#E89B3C]"></span>
                寄出後將寄回 {idea.author.name} 老師
              </div>
            </div>

            {/* title */}
            <div className="mt-5">
              <div className="text-[11px] tracking-[0.18em] uppercase text-[#9A968A] font-mono">A letter to</div>
              <div className="mt-1.5 text-[22px] tracking-tight" style={{ fontFamily: "'Noto Serif TC',serif", fontStyle: "italic", fontWeight: 500 }}>
                {idea.author.name} 老師
              </div>
            </div>

            {/* chips */}
            <div className="mt-5">
              <div className="text-[10.5px] tracking-[0.16em] uppercase text-[#7C7868] font-mono mb-2.5">
                這個點子 ── （可多選）
              </div>
              <ChipSet />
            </div>

            {/* textarea */}
            <div className="mt-4 flex-1">
              <div className="text-[10.5px] tracking-[0.16em] uppercase text-[#7C7868] font-mono mb-2">
                我的課堂風景
              </div>
              <textarea
                className="w-full h-full min-h-[88px] resize-none bg-[rgba(255,253,244,0.04)] border border-white/[0.08] rounded-md p-3 text-[13px] text-[#EFE9DA] placeholder:text-[#6B6757] focus:outline-none focus:border-[#E89B3C]/40 focus:bg-[rgba(255,253,244,0.06)] transition-colors font-light leading-[1.7]"
                placeholder="今天試了你的點子，全班都笑了出來。最讓我意外的是小宇主動舉手⋯⋯"
              ></textarea>
            </div>

            {/* footer */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 text-[10.5px] text-[#7C7868] font-mono">
                <FeatherIcon size={12}/>
                匿名寄出
              </div>
              <button
                onClick={onClose}
                className="group flex items-center gap-1.5 pl-3.5 pr-3 h-8 rounded-full bg-[#E89B3C] text-[#18181B] text-[12px] font-medium hover:bg-[#F2AC55] transition-colors"
              >
                <span>輕輕送出</span>
                <SendIcon size={12} strokeWidth={1.8} className="group-hover:translate-x-0.5 transition-transform"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipSet() {
  const [picked, setPicked] = useState(() => new Set([0]));
  const toggle = (i) => {
    setPicked((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {HELP_CHIPS.map((c, i) => {
        const on = picked.has(i);
        return (
          <button
            key={c}
            onClick={() => toggle(i)}
            className={`flex items-center gap-1 px-2.5 h-7 rounded-full text-[11.5px] transition-all duration-200 ${
              on
                ? "bg-[#E89B3C]/[0.14] text-[#F5B450] border border-[#E89B3C]/40"
                : "border border-white/[0.10] text-[#B8B3A2] hover:border-white/[0.22] hover:text-[#EFE9DA]"
            }`}
          >
            {on && <CheckIcon size={10} strokeWidth={2.2}/>}
            {c}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   App
   ────────────────────────────────────────────────────────────── */
function WallView({ onOpenTree }) {
  const [flippedId, setFlippedId] = useState(null);
  const [litIds, setLitIds] = useState(new Set());

  const close = (id) => {
    setLitIds((s) => new Set(s).add(id));
    setFlippedId(null);
  };

  return (
    <>
      <PageHeader ideasCount={IDEAS.length} />
      <main className="max-w-[1280px] mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {IDEAS.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              flipped={flippedId === idea.id}
              justLit={litIds.has(idea.id)}
              onFlip={() => setFlippedId(idea.id)}
              onClose={() => close(idea.id)}
              onOpenTree={() => onOpenTree(idea.id)}
            />
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-[12px] text-[#9C9C95] font-mono">
          <SparkleIcon size={12}/>
          <span>第 38 週 · 共 142 位老師線上 · 今晚分享了 6 個點子</span>
        </div>
      </main>
    </>
  );
}

function App() {
  const [view, setView] = useState("wall");
  const [detailIdeaId, setDetailIdeaId] = useState(null);
  const [session, setSession] = useState(undefined); // undefined=loading, null=logged out
  const [authMode, setAuthMode] = useState(null); // null | "login" | "signup"

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const openDetail = (id) => { setDetailIdeaId(id); setView("detail"); };
  const closeDetail = () => { setDetailIdeaId(null); setView("wall"); };

  return (
    <div className="min-h-screen text-[#18181B]">
      <TopNav
        view={view}
        setView={setView}
        onCompose={() => setView("compose")}
        session={session}
        onLogin={() => setAuthMode("login")}
        onSignup={() => setAuthMode("signup")}
        onLogout={() => supabase.auth.signOut()}
      />
      {view === "wall" && <WallView onOpenTree={openDetail} />}
      {view === "detail" && <ForkTreeView ideaId={detailIdeaId} onBack={closeDetail} />}
      {view === "compose" && <ComposeView onCancel={() => setView("wall")} onPublished={() => setView("wall")} />}
      {view === "impact" && <ImpactDashboard />}
      {view === "discover" && <DiscoverHub />}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onAuthSuccess={() => setAuthMode(null)}
        />
      )}
    </div>
  );
}

export default App;
