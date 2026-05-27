/* ──────────────────────────────────────────────────────────────
   ImpactDashboard — 個人教學影響力儀表板
   ────────────────────────────────────────────────────────────── */
import { useState as useStateID, useMemo as useMemoID } from "react";
import { Icon, FlameIcon, ForkIcon, SparkleIcon, ChatIcon } from "./icons.jsx";

const TEACHER = {
  name: "黃昀真",
  school: "民和國小",
  subject: "國語 / 五年級 / 第 7 年",
};

const POLAROIDS = [
  {
    id: "p1",
    msg: "你的『便利貼演化作文』救了我焦慮的星期三。全班第一次自己舉手要求再多寫一張。",
    author: "蔡佳穎", school: "民和國中", date: "11.04",
    color: "linear-gradient(135deg,#F4A261,#E9C46A)",
    rot: -3,
    chip: "拯救了我的備課之夜",
  },
  {
    id: "p2",
    msg: "本來覺得會被吵翻，結果安靜得可以聽見孩子在筆下發明字。",
    author: "周明哲", school: "南屏國中", date: "10.28",
    color: "linear-gradient(135deg,#A8DADC,#457B9D)",
    rot: 2,
    chip: "學生眼神都亮了",
  },
  {
    id: "p3",
    msg: "我的學生說：『老師你今天怪怪的，很好玩。』我把這句話寫進教學日誌了。",
    author: "鄭懷恩", school: "光復國小", date: "10.21",
    color: "linear-gradient(135deg,#264653,#2A9D8F)",
    rot: -1.5,
    chip: "讓我重新愛上教書",
  },
  {
    id: "p4",
    msg: "原本準備了 PPT 結果完全沒用上。整節課就跟著孩子的便利貼走，下課了還在走廊接龍。",
    author: "黃子翔", school: "復興國小", date: "10.15",
    color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)",
    rot: 3,
    chip: "比我原本的還好玩",
  },
  {
    id: "p5",
    msg: "把你的方法搬到資源班試。原本不愛寫字的小宇主動拿了第二張便利貼。我哭了。",
    author: "葉若萱", school: "蓬萊國小", date: "10.09",
    color: "linear-gradient(135deg,#E9C46A,#E76F51)",
    rot: -2,
    chip: "解了我卡住的單元",
  },
  {
    id: "p6",
    msg: "謝謝你願意把這個點子寫出來。我把它寄給了我的師培學妹，她說明天就要試。",
    author: "陳秀蓮", school: "南屏國小", date: "09.30",
    color: "linear-gradient(135deg,#F1C0E8,#CFBAF0)",
    rot: 1.5,
    chip: "我也想試試看",
  },
];

function ImpactDashboard() {
  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-12 pb-32">
      {/* header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 text-[12px] text-[#9C9C95] font-mono mb-3">
            <SparkleIcon size={12} className="text-[#E89B3C]"/>
            影響力年報 · 2024
          </div>
          <h1 className="text-[40px] leading-[1.08] tracking-tight font-medium" style={{ textWrap: "balance" }}>
            {TEACHER.name} 老師，
            <br/>
            <span className="text-[#9C9C95]" style={{ fontFamily: "'Noto Serif TC',serif", fontStyle: "italic", fontWeight: 400 }}>
              你的點子今年走進了 <span className="text-[#E89B3C] not-italic font-medium">1,247</span> 間教室。
            </span>
          </h1>
          <div className="mt-3 text-[13.5px] text-[#7A7A74]">
            {TEACHER.school} · {TEACHER.subject}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[12px]">
          {["本月", "本季", "年度", "全部"].map((p, i) => (
            <button
              key={p}
              className={`px-3 h-8 rounded-md transition-colors ${
                i === 2 ? "bg-[#18181B]/[0.05] text-[#18181B]" : "text-[#7A7A74] hover:text-[#18181B]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* hero stat — 啟發學生人數估算 */}
      <HeroStat />

      {/* stat row */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        <BigStat
          label="點亮的燈"
          value="2,418"
          delta="+186"
          deltaLabel="本月"
          icon={<FlameIcon size={14} className="text-[#E89B3C]"/>}
        >
          <Sparkline />
        </BigStat>
        <BigStat
          label="收到的回饋"
          value="396"
          delta="+24"
          deltaLabel="本週"
          icon={<ChatIcon size={14}/>}
        >
          <div className="flex items-end gap-[3px] h-7">
            {[3,5,4,7,6,8,9,7,10,12,9,11].map((h,i)=>(
              <div key={i} className="w-1.5 rounded-sm" style={{ height: `${h*2}px`, background:"#E5E5DE"}}></div>
            ))}
          </div>
        </BigStat>
        <BigStat
          label="被衍生"
          value="26"
          delta="3 個分支"
          deltaLabel="活躍"
          icon={<ForkIcon size={14}/>}
        >
          <MiniForkGlyph />
        </BigStat>
        <BigStat
          label="備課之夜"
          value="23"
          delta="深夜 22:00 後"
          deltaLabel=""
          icon={<MoonIcon size={14}/>}
          accent
        >
          <div className="flex items-center gap-[3px] h-7">
            {Array.from({length: 12}).map((_,i)=>{
              const on = [0,3,4,7,8,10,11].includes(i);
              return (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: on ? "#E89B3C" : "#ECECE6", boxShadow: on ? "0 0 6px rgba(232,155,60,0.55)" : "none" }}
                ></div>
              );
            })}
          </div>
        </BigStat>
      </div>

      {/* heatmap */}
      <section className="rounded-xl border border-[#ECECE6] bg-white p-7 mb-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-medium tracking-tight">分享熱力圖</h2>
            <div className="text-[12px] text-[#9C9C95] mt-1">過去 52 週 · 共 {138} 次分享 / 點亮 / 衍生</div>
          </div>
          <div className="flex items-center gap-2 text-[10.5px] text-[#9C9C95] font-mono">
            少
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{background: HEAT_COLORS[i]}}></div>
            ))}
            多
          </div>
        </div>

        <Heatmap />

        <div className="mt-5 pt-5 border-t border-[#F0F0EA] flex items-center gap-8 text-[12px]">
          <div>
            <span className="text-[#9C9C95]">最熱的一週 · </span>
            <span className="text-[#18181B]">11 月第二週</span>
            <span className="text-[#9C9C95]"> · 14 次互動</span>
          </div>
          <div className="w-px h-4 bg-[#ECECE6]"></div>
          <div>
            <span className="text-[#9C9C95]">最常分享的時間 · </span>
            <span className="text-[#18181B]">週三 22:30</span>
          </div>
          <div className="w-px h-4 bg-[#ECECE6]"></div>
          <div>
            <span className="text-[#9C9C95]">連續分享 · </span>
            <span className="text-[#18181B]">9 週</span>
          </div>
        </div>
      </section>

      {/* Polaroid wall */}
      <section>
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-[17px] font-medium tracking-tight">拍立得感謝牆</h2>
            <div className="text-[12px] text-[#9C9C95] mt-1">
              其他老師在你的點子上練了一節課之後，寫下的小紙條。共 {POLAROIDS.length} 張顯示中 · 396 張總計。
            </div>
          </div>
          <button className="text-[12px] text-[#18181B] hover:underline underline-offset-2">全部 →</button>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-12">
          {POLAROIDS.map((p, i) => (
            <Polaroid key={p.id} p={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function HeroStat() {
  const classrooms = 1247;
  const perClass = 28;
  const students = classrooms * perClass; // 34,916

  return (
    <div className="relative rounded-xl border border-[#ECECE6] bg-white overflow-hidden mb-4">
      {/* faint amber wash */}
      <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: "radial-gradient(circle,#E89B3C,transparent 65%)" }}></div>

      <div className="relative p-7 flex items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#5C5C58]">
            <SparkleIcon size={14} className="text-[#E89B3C]" />
            <span>啟發學生人數估算</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-[15px] text-[#9C9C95] font-mono">~</span>
            <span className="text-[52px] leading-none tracking-tight font-medium text-[#18181B] tabular-nums">
              {students.toLocaleString()}
            </span>
            <span className="text-[15px] text-[#7A7A74] pb-1">名學生</span>
          </div>
          <div className="mt-3 text-[12px] text-[#9C9C95] font-mono">
            {classrooms.toLocaleString()} 間教室 × 平均每班 {perClass} 人
          </div>
        </div>

        {/* row of tiny figures — a quiet visual nod to "students" */}
        <div className="hidden lg:flex flex-col items-end gap-2.5 pr-1">
          <div className="text-[10.5px] tracking-[0.16em] uppercase text-[#9C9C95] font-mono">
            每一格 ≈ 一間教室
          </div>
          <div className="grid grid-cols-12 gap-[5px]" style={{ width: 12 * 11 }}>
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: i < 28 ? "#E89B3C" : "#ECECE6",
                  opacity: i < 28 ? 0.35 + (i / 28) * 0.55 : 1,
                }}
              ></div>
            ))}
          </div>
          <div className="text-[10.5px] text-[#9C9C95]">
            示意 · 實際遍及全台 {classrooms.toLocaleString()} 間
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, delta, deltaLabel, icon, children, accent }) {
  return (
    <div className={`relative rounded-xl border p-5 transition-colors ${
      accent ? "border-[#E89B3C]/25 bg-[#FFFBF0]" : "border-[#ECECE6] bg-white hover:border-[#D9D9D2]"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-[#5C5C58]">
          {icon}
          <span>{label}</span>
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-[32px] tracking-tight font-medium text-[#18181B] tabular-nums leading-none">
          {value}
        </div>
      </div>
      <div className="mt-1 text-[11.5px] text-[#7A7A74]">
        <span className={accent ? "text-[#E89B3C]" : "text-[#18181B]"}>{delta}</span>
        {deltaLabel && <span> · {deltaLabel}</span>}
      </div>
      <div className="mt-4 h-7 flex items-end">{children}</div>
    </div>
  );
}

function Sparkline() {
  // simple sparkline
  const pts = [4, 6, 5, 9, 7, 8, 12, 10, 14, 13, 17, 16, 21];
  const max = 22;
  const w = 220, h = 28;
  const step = w / (pts.length - 1);
  const path =
    "M " +
    pts.map((p, i) => `${i * step} ${h - (p / max) * h}`).join(" L ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#E89B3C" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#E89B3C" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#spark)"/>
      <path d={path} stroke="#E89B3C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function MiniForkGlyph() {
  return (
    <svg viewBox="0 0 100 28" className="w-full h-full">
      <line x1="10" y1="14" x2="90" y2="14" stroke="#E5E5DE" strokeWidth="1.5"/>
      <path d="M 30 14 C 35 14, 40 6, 50 6" stroke="#9C9C95" strokeWidth="1.5" fill="none"/>
      <path d="M 50 14 C 55 14, 60 22, 70 22" stroke="#9C9C95" strokeWidth="1.5" fill="none"/>
      <circle cx="10" cy="14" r="3" fill="#18181B"/>
      <circle cx="30" cy="14" r="2.5" fill="#18181B"/>
      <circle cx="50" cy="6" r="2.5" fill="#9C9C95"/>
      <circle cx="50" cy="14" r="2.5" fill="#18181B"/>
      <circle cx="70" cy="22" r="2.5" fill="#9C9C95"/>
      <circle cx="90" cy="14" r="3" fill="#18181B"/>
    </svg>
  );
}

const MoonIcon = (p) => (
  <Icon {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Icon>
);

/* Heatmap */
const HEAT_COLORS = ["#F2F2EC", "#F5E6C8", "#EFD08C", "#E89B3C", "#C77925"];

function Heatmap() {
  // generate deterministic intensity
  const cells = useMemoID(() => {
    const arr = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let w = 0; w < 52; w++) {
      for (let d = 0; d < 7; d++) {
        const r = rand();
        // bias: most empty, occasional hot weeks
        const hot = w === 33 || w === 44 || w === 47;
        let intensity = 0;
        if (hot && r > 0.25) intensity = 3 + Math.round(rand());
        else if (r > 0.85) intensity = 4;
        else if (r > 0.72) intensity = 3;
        else if (r > 0.55) intensity = 2;
        else if (r > 0.35) intensity = 1;
        else intensity = 0;
        arr.push({ w, d, intensity });
      }
    }
    return arr;
  }, []);

  const monthLabels = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  const dayLabels = ["", "二", "", "四", "", "六", ""];

  return (
    <div className="flex gap-2">
      {/* day labels */}
      <div className="flex flex-col gap-[3px] pt-5 text-[10px] text-[#9C9C95] font-mono">
        {dayLabels.map((d, i) => (
          <div key={i} className="h-[11px] leading-[11px]">{d}</div>
        ))}
      </div>

      <div className="flex-1">
        {/* month labels */}
        <div className="flex justify-between text-[10px] text-[#9C9C95] font-mono mb-1 px-1">
          {monthLabels.map((m, i) => (
            <span key={i}>{m} 月</span>
          ))}
        </div>
        {/* grid */}
        <div className="grid grid-rows-7 grid-flow-col gap-[3px]" style={{ gridAutoColumns: "11px" }}>
          {cells.map((c) => (
            <div
              key={`${c.w}-${c.d}`}
              className="w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-125"
              style={{ background: HEAT_COLORS[c.intensity] }}
              title={`week ${c.w + 1} · ${c.intensity}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Polaroid card */
function Polaroid({ p, index }) {
  return (
    <div
      className="relative group"
      style={{ transform: `rotate(${p.rot}deg)`, transition: "transform 380ms cubic-bezier(0.2,0.8,0.2,1)" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${p.rot}deg)`)}
    >
      <div className="bg-white p-3 pb-6 shadow-[0_10px_24px_-14px_rgba(24,24,27,0.35),0_2px_4px_-1px_rgba(24,24,27,0.06)] rounded-[3px]">
        {/* photo area */}
        <div
          className="relative w-full aspect-[5/4] rounded-[2px] overflow-hidden"
          style={{ background: p.color }}
        >
          {/* paper noise */}
          <div className="absolute inset-0 mix-blend-overlay opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)" }}></div>
          {/* chip floating bottom-left */}
          <div className="absolute left-2.5 bottom-2.5 px-2 py-0.5 rounded-full bg-white/85 backdrop-blur text-[10px] font-medium text-[#18181B] flex items-center gap-1">
            <FlameIcon size={9} className="text-[#E89B3C]"/>
            {p.chip}
          </div>
          {/* tape corner */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[rgba(232,155,60,0.18)] border-x border-[rgba(232,155,60,0.28)] rotate-[2deg]"></div>
        </div>

        {/* message */}
        <p className="mt-4 text-[13px] leading-[1.55] text-[#18181B]" style={{ fontFamily: "'Noto Serif TC',serif", fontStyle: "italic" }}>
          {p.msg}
        </p>

        {/* signature */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[10.5px] font-mono text-[#9C9C95]">
            {p.author} · {p.school}
          </div>
          <div className="text-[10.5px] font-mono text-[#9C9C95]">{p.date}</div>
        </div>
      </div>
    </div>
  );
}

export default ImpactDashboard;
