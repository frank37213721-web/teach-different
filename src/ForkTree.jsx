/* ──────────────────────────────────────────────────────────────
   ForkTreeView — 教案時光機分支圖
   ────────────────────────────────────────────────────────────── */
import { useState as useStateFT } from "react";
import { ArrowLeftIcon, ForkIcon, FlameIcon, SparkleIcon } from "./icons.jsx";

const FORK_DATA = {
  title: "用便利貼演化一篇作文",
  subject: "國語",
  grade: "五年級",
  rootAuthor: "陳秀蓮",
  origin: "南屏國小 · 2024 年 3 月",
  totalVersions: 6,
  totalPractitioners: 142,
};

const COMMITS = [
  {
    id: "c6", commit: "b53fa1", date: "2024-11-02",
    author: { name: "鄭懷恩", school: "光復國小", color: "linear-gradient(135deg,#264653,#2A9D8F)" },
    title: "期末成果展版",
    summary: "把六屆的接龍片段裝訂成「畢業文集」。最後一週讓孩子讀彼此的句子，每人選一句最喜歡的。",
    changes: "+24 / -3 段",
    lights: 67,
    parent: "c5", lane: 0,
  },
  {
    id: "c5", commit: "7da8e9", date: "2024-09-15",
    author: { name: "蔡佳穎", school: "明德國中", color: "linear-gradient(135deg,#A8DADC,#457B9D)" },
    title: "國中銜接版",
    summary: "改成兩人一組共寫一張便利貼，加入「英文標題」規則，讓國一生練雙語。",
    changes: "+8 / -2 段",
    lights: 45,
    parent: "c2", lane: 0,
  },
  {
    id: "c4", commit: "c47b21", date: "2024-07-03",
    author: { name: "黃子翔", school: "復興國小", color: "linear-gradient(135deg,#2A9D8F,#264653)" },
    title: "數學課的便利貼接龍",
    summary: "把句子換成數學算式，前一張的答案是下一張的題目。意外發現孩子主動算錯位重來。",
    changes: "+12 / -5 段",
    lights: 38,
    parent: "c2", lane: 2,
  },
  {
    id: "c3", commit: "92cf04", date: "2024-05-21",
    author: { name: "周明哲", school: "南屏國中", color: "linear-gradient(135deg,#F4A261,#E76F51)" },
    title: "改為小組接龍版",
    summary: "分四組同時接龍，最後牆面變成四篇平行宇宙的同一個故事。比一個人寫熱鬧得多。",
    changes: "+6 / -1 段",
    lights: 29,
    parent: "c2", lane: 1,
  },
  {
    id: "c2", commit: "a01e7d", date: "2024-04-08",
    author: { name: "林宛庭", school: "民和國小", color: "linear-gradient(135deg,#E9C46A,#E76F51)" },
    title: "加入互評環節",
    summary: "在原版基礎上加了「下一位可以撕掉前一張」的規則，原本害怕寫作的孩子反而變得敢寫。",
    changes: "+4 / -0 段",
    lights: 142,
    parent: "c1", lane: 0,
  },
  {
    id: "c1", commit: "f3a91c", date: "2024-03-12",
    author: { name: "陳秀蓮", school: "南屏國小", color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)" },
    title: "原點 · 便利貼接龍寫作",
    summary: "想讓寫作焦慮的學生敢動筆。一張便利貼只能寫一句話，剛好限制住他們的恐懼。",
    changes: "initial commit",
    lights: 38,
    parent: null, lane: 0,
    isOrigin: true,
  },
];

const LANE_X = [42, 78, 114];
const ROW_H = 132;
const NODE_R = 7;
const LANE_COLORS = ["#18181B", "#E89B3C", "#2A9D8F"];

function ForkTreeView({ ideaId, onBack }) {
  const [selected, setSelected] = useStateFT("c2");

  const totalH = COMMITS.length * ROW_H;
  const sel = COMMITS.find((c) => c.id === selected);

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-10 pb-32">
      {/* breadcrumb */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-1.5 text-[12px] text-[#9C9C95] font-mono">
          <button onClick={onBack} className="hover:text-[#18181B] flex items-center gap-1.5 cursor-pointer">
            <ArrowLeftIcon size={12}/>
            點子牆
          </button>
          <span>/</span>
          <a className="hover:text-[#18181B] cursor-pointer">{FORK_DATA.subject}</a>
          <span>/</span>
          <span className="text-[#18181B]">{FORK_DATA.title}</span>
        </div>
        <button
          onClick={onBack}
          className="text-[12px] text-[#7A7A74] hover:text-[#18181B] transition-colors"
        >
          關閉 ✕
        </button>
      </div>

      {/* title block */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium text-[#18181B] bg-[#F2F2EC] border border-[#ECECE6]">
              {FORK_DATA.subject}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] text-[#7A7A74] border border-[#ECECE6]">
              {FORK_DATA.grade}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] text-[#7A7A74] font-mono">
              main · 6 commits
            </span>
          </div>
          <h1 className="text-[36px] leading-[1.1] tracking-tight font-medium">
            {FORK_DATA.title}
          </h1>
          <div className="mt-3 text-[13.5px] text-[#7A7A74]">
            起源於{" "}
            <span className="text-[#18181B]">{FORK_DATA.rootAuthor}</span> 老師 ·{" "}
            {FORK_DATA.origin}
          </div>
        </div>
        <div className="flex items-center gap-6 pb-1">
          <FTStat label="版本數" value={FORK_DATA.totalVersions} />
          <div className="w-px h-8 bg-[#ECECE6]"></div>
          <FTStat label="實踐者" value={FORK_DATA.totalPractitioners} />
          <div className="w-px h-8 bg-[#ECECE6]"></div>
          <FTStat label="分支" value={3} />
        </div>
      </div>

      {/* tree + detail panel */}
      <div className="grid grid-cols-[1fr_360px] gap-8">
        {/* TREE */}
        <div className="relative rounded-xl border border-[#ECECE6] bg-white">
          {/* tab strip */}
          <div className="flex items-center justify-between px-5 h-11 border-b border-[#ECECE6]">
            <div className="flex items-center gap-1 text-[12.5px]">
              <button className="px-2.5 h-7 rounded-md bg-[#18181B]/[0.05] text-[#18181B] flex items-center gap-1.5">
                <ForkIcon size={12}/>
                時光機分支圖
              </button>
              <button className="px-2.5 h-7 rounded-md text-[#7A7A74] hover:text-[#18181B]">
                線性時間軸
              </button>
              <button className="px-2.5 h-7 rounded-md text-[#7A7A74] hover:text-[#18181B]">
                差異對照
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#9C9C95] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]"></span> main
              <span className="w-1.5 h-1.5 rounded-full bg-[#E89B3C] ml-2"></span> 分支 a
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] ml-2"></span> 分支 b
            </div>
          </div>

          {/* tree body */}
          <div className="relative pl-2 pr-6 py-6" style={{ minHeight: totalH + 40 }}>
            {/* SVG branch lines */}
            <svg
              className="absolute left-0 top-6 pointer-events-none"
              width={150}
              height={totalH}
              style={{ overflow: "visible" }}
            >
              {/* mainline continuous backdrop on lane 0 */}
              {(() => {
                const lane0Indices = COMMITS.map((c, i) => (c.lane === 0 ? i : -1)).filter((x) => x >= 0);
                if (lane0Indices.length < 2) return null;
                const top = lane0Indices[0] * ROW_H + ROW_H / 2;
                const bot = lane0Indices[lane0Indices.length - 1] * ROW_H + ROW_H / 2;
                return (
                  <line
                    x1={LANE_X[0]} y1={top + NODE_R}
                    x2={LANE_X[0]} y2={bot - NODE_R}
                    stroke="#E5E5DE" strokeWidth="1.5"
                  />
                );
              })()}

              {/* per-commit connections */}
              {COMMITS.map((c, i) => {
                if (!c.parent) return null;
                const j = COMMITS.findIndex((x) => x.id === c.parent);
                const x1 = LANE_X[c.lane];
                const y1 = i * ROW_H + ROW_H / 2;
                const x2 = LANE_X[COMMITS[j].lane];
                const y2 = j * ROW_H + ROW_H / 2;
                const color = LANE_COLORS[c.lane] || "#9C9C95";

                if (c.lane === COMMITS[j].lane) return null;
                const d = `M ${x1} ${y1 + NODE_R} C ${x1} ${(y1 + y2) / 2 + 20}, ${x2} ${(y1 + y2) / 2 - 20}, ${x2} ${y2 - NODE_R}`;
                return (
                  <path
                    key={c.id}
                    d={d}
                    stroke={color}
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.55"
                  />
                );
              })}

              {/* nodes */}
              {COMMITS.map((c, i) => {
                const x = LANE_X[c.lane];
                const y = i * ROW_H + ROW_H / 2;
                const color = LANE_COLORS[c.lane] || "#9C9C95";
                const isSel = selected === c.id;
                return (
                  <g key={c.id}>
                    {isSel && (
                      <circle cx={x} cy={y} r={NODE_R + 5} fill={color} opacity="0.10" />
                    )}
                    <circle
                      cx={x} cy={y} r={NODE_R}
                      fill={c.isOrigin ? "#FFFBF0" : "white"}
                      stroke={color}
                      strokeWidth={isSel ? 2 : 1.5}
                    />
                    {c.isOrigin && (
                      <circle cx={x} cy={y} r={2.5} fill="#E89B3C" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* commit rows */}
            <div className="relative" style={{ marginLeft: 140 }}>
              {COMMITS.map((c, i) => {
                const top = i * ROW_H;
                const isSel = selected === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className={`absolute left-0 right-0 cursor-pointer group transition-all ${
                      isSel ? "" : "opacity-90 hover:opacity-100"
                    }`}
                    style={{ top, height: ROW_H - 16 }}
                  >
                    <div
                      className={`h-full rounded-lg border px-5 py-4 transition-all ${
                        isSel
                          ? "border-[#18181B]/15 bg-[#FCFBF5] shadow-[0_4px_18px_-12px_rgba(24,24,27,0.25)]"
                          : "border-transparent hover:border-[#ECECE6] hover:bg-[#FAFAF5]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium text-white"
                            style={{ background: c.author.color }}
                          >
                            {c.author.name[0]}
                          </div>
                          <div className="leading-tight">
                            <div className="text-[13px] text-[#18181B] font-medium flex items-center gap-1.5">
                              {c.author.name}
                              {c.isOrigin && (
                                <span className="text-[10px] font-mono text-[#E89B3C] border border-[#E89B3C]/30 bg-[#FFFBF0] rounded px-1 py-px">
                                  ORIGIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#9C9C95]">{c.author.school}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-[#9C9C95]">
                          <span>{c.date}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#F2F2EC] text-[#18181B]">
                            {c.commit}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-[15px] text-[#18181B] tracking-tight font-medium">
                        {c.title}
                      </div>
                      <div className="mt-1.5 text-[12.5px] text-[#5C5C58] leading-[1.55] line-clamp-2">
                        {c.summary}
                      </div>
                      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[#9C9C95] font-mono">
                        <span className="flex items-center gap-1">
                          <FlameIcon size={11} className="text-[#E89B3C]"/>
                          {c.lights}
                        </span>
                        <span>·</span>
                        <span>{c.changes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DETAIL PANEL */}
        <aside className="relative">
          <div className="sticky top-[88px]">
            <div className="rounded-xl border border-[#ECECE6] bg-white overflow-hidden">
              <div className="p-5 border-b border-[#ECECE6]">
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#9C9C95]">
                  <ForkIcon size={11}/> commit {sel.commit}
                </div>
                <h3 className="mt-3 text-[18px] tracking-tight font-medium" style={{textWrap: "balance"}}>
                  {sel.title}
                </h3>
                <div className="mt-3 flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium text-white"
                    style={{ background: sel.author.color }}
                  >
                    {sel.author.name[0]}
                  </div>
                  <div className="leading-tight">
                    <div className="text-[12.5px] text-[#18181B] font-medium">{sel.author.name}</div>
                    <div className="text-[10.5px] text-[#9C9C95]">{sel.author.school} · {sel.date}</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-[#9C9C95] mb-2">
                  改編說明
                </div>
                <p className="text-[13px] leading-[1.7] text-[#3C3C38]" style={{ fontFamily: "'Noto Serif TC',serif" }}>
                  {sel.summary}
                </p>

                <div className="mt-5 pt-4 border-t border-[#F0F0EA] grid grid-cols-2 gap-3">
                  <SmallStat label="這個版本的燈" value={sel.lights} />
                  <SmallStat label="變動" value={sel.changes} mono />
                </div>

                <button className="mt-5 w-full h-9 rounded-md bg-[#18181B] text-white text-[12.5px] font-medium hover:bg-[#2A2A2E] transition-colors flex items-center justify-center gap-1.5">
                  <ForkIcon size={12} strokeWidth={1.8}/>
                  從這個版本再衍生
                </button>
                <button className="mt-2 w-full h-9 rounded-md border border-[#ECECE6] text-[#18181B] text-[12.5px] hover:bg-[#FAFAF5] transition-colors flex items-center justify-center gap-1.5">
                  查看完整教案
                </button>
              </div>
            </div>

            {/* compare hint */}
            <div className="mt-3 px-4 py-3 rounded-lg bg-[#F8F8F2] border border-[#ECECE6] flex items-start gap-2">
              <SparkleIcon size={13} className="text-[#E89B3C] mt-0.5"/>
              <div className="text-[11.5px] leading-[1.55] text-[#5C5C58]">
                想看這個版本和原版的差異？點擊上方的「差異對照」分頁。
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FTStat({ label, value }) {
  return (
    <div className="text-right">
      <div className="text-[20px] font-medium text-[#18181B] tracking-tight tabular-nums">{value}</div>
      <div className="text-[11px] text-[#7A7A74] mt-0.5">{label}</div>
    </div>
  );
}
function SmallStat({ label, value, mono }) {
  return (
    <div>
      <div className={`text-[15px] font-medium text-[#18181B] tabular-nums ${mono ? "font-mono text-[13px]" : ""}`}>
        {value}
      </div>
      <div className="text-[10.5px] text-[#9C9C95] mt-0.5">{label}</div>
    </div>
  );
}

export default ForkTreeView;
