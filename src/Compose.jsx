/* ──────────────────────────────────────────────────────────────
   ComposeView — 發布教學點子（distraction-free）
   ────────────────────────────────────────────────────────────── */
import { useState as useStateCP, useRef as useRefCP } from "react";
import { Icon, ArrowLeftIcon, ForkIcon, CheckIcon, FeatherIcon, PlusIcon } from "./icons.jsx";

/* local icons */
const CloudIcon = (p) => (
  <Icon {...p}>
    <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 0 0 4 12a5 5 0 0 0 1 9.93"/>
    <path d="M5 19h12.5"/>
  </Icon>
);
const PlayIcon = (p) => (
  <Icon {...p}><polygon points="6 4 20 12 6 20 6 4"/></Icon>
);
const XIcon = (p) => (
  <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>
);
const SaveIcon = (p) => (
  <Icon {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <path d="M17 21v-8H7v8M7 3v5h8"/>
  </Icon>
);
const HashIcon = (p) => (
  <Icon {...p}><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></Icon>
);

function ytId(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
    }
    return null;
  } catch (e) {
    return null;
  }
}

function looksLikeDrive(url) {
  if (!url) return null;
  const t = url.trim();
  if (!/^https?:\/\//.test(t)) return null;
  try {
    const u = new URL(t);
    const isDrive = /drive\.google\.com|docs\.google\.com/.test(u.hostname);
    if (!isDrive) return { kind: "link", host: u.hostname };
    if (u.pathname.includes("/folders/")) return { kind: "folder", host: u.hostname };
    if (u.pathname.includes("/document/")) return { kind: "doc", host: u.hostname };
    if (u.pathname.includes("/spreadsheets/")) return { kind: "sheet", host: u.hostname };
    if (u.pathname.includes("/presentation/")) return { kind: "slides", host: u.hostname };
    return { kind: "drive", host: u.hostname };
  } catch (e) {
    return null;
  }
}

function ComposeView({ onCancel, onPublished }) {
  const [title, setTitle] = useStateCP("");
  const [excerpt, setExcerpt] = useStateCP("");
  const [yt, setYt] = useStateCP("");
  const [drive, setDrive] = useStateCP("");
  const [photos, setPhotos] = useStateCP([null, null]);
  const [subject, setSubject] = useStateCP("自然");
  const [grade, setGrade] = useStateCP("五年級");
  const [forkedFrom, setForkedFrom] = useStateCP(null);

  const EXCERPT_LIMIT = 50;
  const overLimit = excerpt.length > EXCERPT_LIMIT;
  const ytVideoId = ytId(yt);
  const driveInfo = looksLikeDrive(drive);
  const filledPhotos = photos.filter(Boolean).length;

  const ready = title.trim().length > 0 && excerpt.trim().length > 0 && !overLimit;

  const subjects = ["國語", "數學", "自然", "社會", "音樂", "美術", "綜合", "英語", "體育"];
  const grades = ["一年級", "二年級", "三年級", "四年級", "五年級", "六年級", "國中", "高中"];

  return (
    <div className="relative">
      {/* compose-page chrome */}
      <div className="sticky top-[60px] z-20 bg-[rgba(250,250,247,0.85)] backdrop-blur-md border-b border-[#ECECE6]">
        <div className="max-w-[760px] mx-auto px-8 h-12 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[12.5px] text-[#7A7A74] hover:text-[#18181B] transition-colors"
          >
            <ArrowLeftIcon size={13}/>
            回到點子牆
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-[#9C9C95] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9C9C95]"></span>
              草稿 · 自動保存於 2 分鐘前
            </div>
            <button className="h-7 px-2.5 rounded-md flex items-center gap-1.5 text-[11.5px] text-[#5C5C58] hover:bg-[#18181B]/[0.05] hover:text-[#18181B] transition-colors">
              <SaveIcon size={12}/>
              保存草稿
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[760px] mx-auto px-8 py-16 pb-40">
        {/* breadcrumb / context */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2 text-[11.5px] text-[#9C9C95] font-mono">
            <FeatherIcon size={12}/>
            <span>新的教學點子</span>
            <span>·</span>
            <span>commit by 昀真</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DropdownChip value={subject} options={subjects} onChange={setSubject}/>
            <DropdownChip value={grade} options={grades} onChange={setGrade}/>
            <button
              onClick={() => setForkedFrom(forkedFrom ? null : { name: "陳秀蓮", commit: "f3a91c" })}
              className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11.5px] transition-colors ${
                forkedFrom
                  ? "bg-[#FFFBF0] text-[#18181B] border border-[#E89B3C]/30"
                  : "text-[#7A7A74] border border-[#ECECE6] hover:text-[#18181B] hover:border-[#D6D6CE]"
              }`}
            >
              <ForkIcon size={11}/>
              {forkedFrom ? (
                <span className="font-mono">forked · {forkedFrom.name}</span>
              ) : (
                <span>標記衍生自...</span>
              )}
            </button>
          </div>
        </div>

        {/* TITLE */}
        <Field>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
            placeholder="輸入你的教學點子標題..."
            className="w-full block resize-none bg-transparent outline-none text-[40px] leading-[1.18] tracking-tight font-medium text-[#18181B] placeholder:text-[#C5C5BE] placeholder:font-normal"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", overflow: "hidden" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <div className="mt-2 text-[11px] text-[#C5C5BE] font-mono">
            如：用音樂IC實作體會電晶體功能
          </div>
        </Field>

        {/* EXCERPT */}
        <Field className="mt-10">
          <Label>精髓</Label>
          <div className="relative">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="用不超過 50 個字，快狠準地介紹這個點子的精髓..."
              className="w-full block resize-none bg-transparent outline-none text-[18px] leading-[1.65] text-[#18181B] placeholder:text-[#C5C5BE]"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            />
            <div
              className={`absolute right-0 bottom-0 text-[11px] font-mono tabular-nums transition-colors ${
                overLimit ? "text-[#E76F51]" : excerpt.length > 40 ? "text-[#E89B3C]" : "text-[#C5C5BE]"
              }`}
            >
              {excerpt.length} <span className="text-[#D9D9D2]">/ {EXCERPT_LIMIT}</span>
            </div>
          </div>
        </Field>

        {/* YOUTUBE */}
        <Field className="mt-12">
          <Label>設計這堂課的初衷</Label>
          <Sub>貼入一段 YouTube 影片，告訴其他老師你為什麼想做這個。</Sub>

          <div className="mt-3 flex items-center gap-2 border border-[#ECECE6] rounded-md h-11 px-3 focus-within:border-[#18181B]/30 transition-colors bg-white">
            <PlayIcon size={14} className="text-[#9C9C95]"/>
            <input
              type="url"
              value={yt}
              onChange={(e) => setYt(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 bg-transparent outline-none text-[13.5px] text-[#18181B] placeholder:text-[#C5C5BE] font-mono"
            />
            {yt && !ytVideoId && (
              <span className="text-[11px] text-[#E76F51]">這看起來不像 YouTube</span>
            )}
            {ytVideoId && (
              <span className="text-[11px] text-[#2A9D8F] flex items-center gap-1">
                <CheckIcon size={11} strokeWidth={2.2}/> 已連結
              </span>
            )}
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              ytVideoId ? "max-h-[360px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            {ytVideoId && <YouTubePreview videoId={ytVideoId} />}
          </div>
        </Field>

        {/* DRIVE */}
        <Field className="mt-12">
          <Label>備課資源</Label>
          <Sub>把學習單、簡報、Google 雲端資料夾連結貼過來。</Sub>

          <div className="mt-3 flex items-center gap-2 border border-[#ECECE6] rounded-md h-11 px-3 focus-within:border-[#18181B]/30 transition-colors bg-white">
            <CloudIcon size={14} className="text-[#9C9C95]"/>
            <input
              type="url"
              value={drive}
              onChange={(e) => setDrive(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="flex-1 bg-transparent outline-none text-[13.5px] text-[#18181B] placeholder:text-[#C5C5BE] font-mono"
            />
            {driveInfo && (
              <DriveBadge info={driveInfo}/>
            )}
          </div>
        </Field>

        {/* PHOTOS */}
        <Field className="mt-12">
          <div className="flex items-end justify-between mb-1">
            <Label>課堂剪影</Label>
            <span className="text-[11px] text-[#C5C5BE] font-mono">{filledPhotos} / 2</span>
          </div>
          <Sub>選 1–2 張照片。教室一角、黑板上的塗鴉、學生的學習單，都好。</Sub>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {photos.map((p, i) => (
              <DropTile
                key={i}
                photo={p}
                onPick={(file) => {
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setPhotos((arr) => {
                    const next = [...arr];
                    next[i] = { url, name: file.name };
                    return next;
                  });
                }}
                onRemove={() => {
                  setPhotos((arr) => {
                    const next = [...arr];
                    if (next[i]?.url) URL.revokeObjectURL(next[i].url);
                    next[i] = null;
                    return next;
                  });
                }}
              />
            ))}
          </div>
        </Field>

        {/* live preview */}
        <div className="mt-14 pt-6 border-t border-dashed border-[#ECECE6]">
          <div className="text-[10.5px] tracking-[0.2em] uppercase font-mono text-[#C5C5BE] mb-3">
            preview · how it appears on the wall
          </div>
          <MiniCardPreview
            title={title || "輸入你的教學點子標題..."}
            excerpt={excerpt || "用不超過 50 個字，快狠準地介紹這個點子的精髓..."}
            subject={subject}
            grade={grade}
            forkedFrom={forkedFrom}
            empty={!title && !excerpt}
          />
        </div>
      </main>

      {/* publish bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-[760px] mx-auto px-8 pb-6 flex justify-end pointer-events-auto">
          <div className="flex items-center gap-3 bg-white border border-[#ECECE6] rounded-full pl-5 pr-1 py-1 shadow-[0_10px_30px_-15px_rgba(24,24,27,0.20)]">
            <div className="text-[11.5px] text-[#7A7A74]">
              {ready ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]"></span>
                  準備好了，可以發布
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9D9D2]"></span>
                  標題與精髓填好就可以發布
                </span>
              )}
            </div>
            <button
              disabled={!ready}
              onClick={onPublished}
              className={`group h-10 pl-4 pr-5 rounded-full text-[13px] font-medium transition-all flex items-center gap-2 ${
                ready
                  ? "bg-[#18181B] text-white hover:bg-[#2A2A2E] hover:pr-6 shadow-[0_4px_18px_-6px_rgba(24,24,27,0.45)]"
                  : "bg-[#ECECE6] text-[#9C9C95] cursor-not-allowed"
              }`}
            >
              <span>發布點子</span>
              <span className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                🚀
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ children, className = "" }) {
  return <section className={className}>{children}</section>;
}
function Label({ children }) {
  return (
    <div className="text-[10.5px] tracking-[0.2em] uppercase font-mono text-[#9C9C95] mb-1.5">
      {children}
    </div>
  );
}
function Sub({ children }) {
  return <div className="text-[12.5px] text-[#7A7A74] leading-[1.55]">{children}</div>;
}

function DropdownChip({ value, options, onChange }) {
  const [open, setOpen] = useStateCP(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11.5px] text-[#18181B] border border-[#ECECE6] hover:border-[#D6D6CE] bg-white transition-colors"
      >
        <HashIcon size={10} className="text-[#9C9C95]"/>
        {value}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
          <div className="absolute top-9 right-0 z-20 w-32 py-1 bg-white border border-[#ECECE6] rounded-md shadow-[0_10px_30px_-12px_rgba(24,24,27,0.2)]">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#FAFAF5] transition-colors ${
                  opt === value ? "text-[#18181B] font-medium" : "text-[#5C5C58]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function YouTubePreview({ videoId }) {
  return (
    <div className="rounded-xl border border-[#ECECE6] overflow-hidden bg-[#0E0E10] group">
      <div className="grid grid-cols-[200px_1fr] sm:grid-cols-[260px_1fr]">
        <div className="relative aspect-video bg-[#0E0E10] overflow-hidden">
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <PlayIcon size={16} className="text-[#18181B] translate-x-px" strokeWidth={1.8}/>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between text-[#EFE9DA]">
          <div>
            <div className="flex items-center gap-1.5 text-[10.5px] tracking-[0.18em] uppercase font-mono text-[#7C7868] mb-2">
              <span className="w-1 h-1 rounded-full bg-[#E76F51]"></span>
              設計動機 · YouTube
            </div>
            <div
              className="text-[14.5px] leading-[1.45] tracking-tight"
              style={{ fontFamily: "'Noto Serif TC',serif", fontStyle: "italic" }}
            >
              「為什麼我想做這堂課」
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#9A968A] font-mono">
              youtube.com / watch?v={videoId.slice(0, 8)}...
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2 text-[10.5px] text-[#7C7868]">
              <span>影片預覽會顯示在你的點子卡片背面</span>
            </div>
            <button className="text-[10.5px] text-[#E89B3C] hover:text-[#F5B450] font-mono">
              在新分頁開啟 ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriveBadge({ info }) {
  const labels = { folder: "資料夾", doc: "Google 文件", sheet: "試算表", slides: "簡報", drive: "雲端硬碟", link: "外部連結" };
  const colors = { folder: "#2A9D8F", doc: "#457B9D", sheet: "#2A9D8F", slides: "#E89B3C", drive: "#457B9D", link: "#9C9C95" };
  return (
    <span
      className="flex items-center gap-1 text-[10.5px] font-mono px-1.5 py-0.5 rounded"
      style={{ color: colors[info.kind], background: `${colors[info.kind]}14` }}
    >
      <CheckIcon size={10} strokeWidth={2.2}/>
      {labels[info.kind]}
    </span>
  );
}

function DropTile({ photo, onPick, onRemove }) {
  const [hover, setHover] = useStateCP(false);
  const inputRef = useRefCP(null);

  if (photo) {
    return (
      <div
        className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#ECECE6] bg-[#F2F2EC] group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img src={photo.url} alt="" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}></div>
        <div className={`absolute inset-x-3 bottom-3 flex items-center justify-between transition-all ${hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
          <span className="text-[10.5px] text-white/90 truncate font-mono">{photo.name}</span>
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-full bg-white text-[#18181B] flex items-center justify-center hover:bg-[#E76F51] hover:text-white transition-colors"
          >
            <XIcon size={13} strokeWidth={1.8}/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onPick(file);
      }}
      className={`relative aspect-[4/3] rounded-lg border border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
        hover
          ? "border-[#18181B]/30 bg-[#FAFAF5]"
          : "border-[#D9D9D2] bg-[#FAFAF7] hover:border-[#9C9C95] hover:bg-[#F5F5EF]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      <div className="w-9 h-9 rounded-full bg-white border border-[#ECECE6] flex items-center justify-center transition-colors">
        <PlusIcon size={15} className="text-[#9C9C95]" strokeWidth={1.6}/>
      </div>
      <div className="text-[12px] text-[#7A7A74]">點擊或拖放照片</div>
      <div className="text-[10.5px] text-[#C5C5BE] font-mono">JPG · PNG · 最大 5MB</div>
    </button>
  );
}

function MiniCardPreview({ title, excerpt, subject, grade, forkedFrom, empty }) {
  return (
    <div
      className={`rounded-xl border border-[#ECECE6] bg-white p-5 max-w-[400px] mx-auto transition-opacity ${
        empty ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <span className="px-2 py-0.5 rounded text-[11px] font-medium text-[#18181B] bg-[#F2F2EC] border border-[#ECECE6]">
          {subject}
        </span>
        <span className="px-2 py-0.5 rounded text-[11px] text-[#7A7A74] border border-[#ECECE6]">
          {grade}
        </span>
      </div>
      <h4 className="text-[16px] font-medium tracking-tight text-[#18181B] leading-[1.35]">
        {title}
      </h4>
      <p
        className="mt-2 text-[12.5px] leading-[1.55] text-[#5C5C58] line-clamp-2"
        style={{ fontFamily: "'Noto Serif TC',serif" }}
      >
        {excerpt}
      </p>
      {forkedFrom && (
        <div className="mt-3 flex items-center gap-1.5 text-[10.5px] text-[#7A7A74] font-mono">
          <ForkIcon size={10} className="text-[#9C9C95]" />
          forked from <span className="text-[#18181B]">{forkedFrom.name}</span>
          <span className="text-[#C5C5BE]">·</span>
          <span className="text-[#9C9C95]">{forkedFrom.commit}</span>
        </div>
      )}
    </div>
  );
}

export default ComposeView;
