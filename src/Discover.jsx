/* ──────────────────────────────────────────────────────────────
   DiscoverHub — 主題探索 / 課程策展
   ────────────────────────────────────────────────────────────── */
import { useState as useStateDH } from "react";
import { Icon, FlameIcon, PlusIcon, FeatherIcon } from "./icons.jsx";

/* topic-specific icons */
const LeafIcon = (p) => (
  <Icon {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6"/>
  </Icon>
);
const ChipIcon = (p) => (
  <Icon {...p}>
    <rect x="6" y="6" width="12" height="12" rx="1.5"/>
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>
    <rect x="9" y="9" width="6" height="6"/>
  </Icon>
);
const BoltIcon = (p) => (
  <Icon {...p}>
    <path d="M13 2 4.09 12.97a.5.5 0 0 0 .41.79H11l-1 8.24 8.91-10.97a.5.5 0 0 0-.41-.79H13z"/>
  </Icon>
);
const PaletteIcon = (p) => (
  <Icon {...p}>
    <path d="M12 2a10 10 0 1 0 10 10c0-1.66-1.34-3-3-3h-2a2 2 0 0 1 0-4 2 2 0 0 0 2-2 3 3 0 0 0-3-3z"/>
    <circle cx="7.5" cy="10.5" r="1"/>
    <circle cx="12" cy="7" r="1"/>
    <circle cx="16.5" cy="10.5" r="1"/>
    <circle cx="8.5" cy="15" r="1"/>
  </Icon>
);
const LangIcon = (p) => (
  <Icon {...p}>
    <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1"/>
    <path d="m22 22-5-10-5 10M14 18h6"/>
  </Icon>
);
const FilterIcon = (p) => (
  <Icon {...p}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
  </Icon>
);
const TrendIcon = (p) => (
  <Icon {...p}>
    <path d="m22 7-8.5 8.5-5-5L2 17"/>
    <path d="M16 7h6v6"/>
  </Icon>
);
const SchoolIcon = (p) => (
  <Icon {...p}>
    <path d="m4 6 8-4 8 4-8 4-8-4z"/>
    <path d="M2 10v6c0 .55.45 1 1 1h18c.55 0 1-.45 1-1v-6"/>
    <path d="M6 11v5M18 11v5"/>
  </Icon>
);

const TOPICS = [
  {
    id: "sustain", name: "永續", en: "Sustainability", icon: LeafIcon,
    accent: "#2A9D8F", accentSoft: "#E5F1EE",
    hero: "從一個保溫杯，到一座城市的氣候對話。",
    sub: "永續主題正在連結 12 所學校的環境議題課堂。",
    count: 28,
    pulse: { teachers: 12, subjects: ["自然", "社會", "綜合"], schools: 8 },
  },
  {
    id: "semi", name: "半導體", en: "Semiconductor", icon: ChipIcon,
    accent: "#264653", accentSoft: "#E6EAEC",
    hero: "從微觀的電晶體，到宏觀的產業鏈，\n激發下一個世代的科技想像。",
    sub: "與三所高中物理科共備的策展主題。",
    count: 17,
    pulse: { teachers: 4, subjects: ["物理", "英文", "資訊"], schools: 5 },
  },
  {
    id: "energy", name: "能源", en: "Energy", icon: BoltIcon,
    accent: "#E89B3C", accentSoft: "#FFF4E0",
    hero: "讓每一度電都長出故事。",
    sub: "9 位老師正在共備風光電與生活的連結。",
    count: 21,
    pulse: { teachers: 9, subjects: ["自然", "社會"], schools: 6 },
  },
  {
    id: "aesthetic", name: "美感", en: "Aesthetics", icon: PaletteIcon,
    accent: "#A05C7B", accentSoft: "#F5E9EF",
    hero: "讓孩子的眼睛，學會慢下來看一件事物。",
    sub: "跨美術、國語、生活的策展主題。",
    count: 19,
    pulse: { teachers: 7, subjects: ["美術", "國語", "生活"], schools: 5 },
  },
  {
    id: "bilingual", name: "雙語", en: "Bilingual", icon: LangIcon,
    accent: "#457B9D", accentSoft: "#E8EFF4",
    hero: "讓另一種語言，成為新的看世界方式。",
    sub: "11 校雙語推動老師的共備頻道。",
    count: 34,
    pulse: { teachers: 11, subjects: ["英文", "自然", "社會"], schools: 11 },
  },
];

const DISCOVER_IDEAS = {
  semi: [
    { id: "d-s1", title: "用音樂IC實作體會電晶體功能", excerpt: "拆解一張會發出生日快樂歌的賀卡，讓孩子第一次親手觸摸到電晶體的 base / collector / emitter。", tags: ["半導體", "音樂IC", "探究與實作"], author: { name: "周明哲", school: "南屏高中", color: "linear-gradient(135deg,#264653,#2A9D8F)" }, lights: 187, daysAgo: 2 },
    { id: "d-s2", title: "矽晶圓的旅行：從沙到手機", excerpt: "用一塊矽藻土、一張產業地圖，讓學生畫出晶片如何從台南的沙，旅行到他們的手機。", tags: ["半導體", "產業鏈", "地理"], author: { name: "黃子翔", school: "復興高中", color: "linear-gradient(135deg,#2A9D8F,#264653)" }, lights: 142, daysAgo: 5 },
    { id: "d-s3", title: "EUV 光刻像極了影印機", excerpt: "用透明片、手電筒、白紙演示光刻原理。學生親手「印」出一片自己的 IC 圖案。", tags: ["半導體", "光學", "類比教學"], author: { name: "葉若萱", school: "蓬萊高中", color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)" }, lights: 96, daysAgo: 8 },
    { id: "d-s4", title: "晶圓代工 vs IDM：用桌遊理解商業模式", excerpt: "三人一組各扮演 fabless / foundry / IDM，從接單到出貨跑一輪，最後算誰的毛利率最高。", tags: ["半導體", "產業鏈", "桌遊"], author: { name: "鄭懷恩", school: "光復高中", color: "linear-gradient(135deg,#264653,#2A9D8F)" }, lights: 128, daysAgo: 11 },
    { id: "d-s5", title: "閱讀一篇 TSMC 法說會逐字稿", excerpt: "和英文老師共備：拆解一段法說會 Q&A，學生練的不只是術語，是「在新聞之前讀懂訊號」。", tags: ["半導體", "雙語", "媒體素養"], author: { name: "蔡佳穎", school: "明德高中", color: "linear-gradient(135deg,#A8DADC,#457B9D)" }, lights: 84, daysAgo: 14 },
    { id: "d-s6", title: "把摩爾定律畫成手繪折線", excerpt: "讓學生在 1971 → 2024 的時間軸上手繪自己的「成長曲線」，再對齊摩爾定律。談指數的感覺。", tags: ["半導體", "數學", "指數成長"], author: { name: "林宛庭", school: "民和高中", color: "linear-gradient(135deg,#E9C46A,#E76F51)" }, lights: 72, daysAgo: 18 },
  ],
  sustain: [
    { id: "d-su1", title: "保溫杯的一週日記", excerpt: "全班帶著保溫杯一週，記錄省下幾個紙杯、走幾步去裝水。最後做成一面「省下的杯子牆」。", tags: ["永續", "日常實踐", "資料視覺化"], author: { name: "蔡佳穎", school: "明德國小", color: "linear-gradient(135deg,#A8DADC,#457B9D)" }, lights: 234, daysAgo: 3 },
    { id: "d-su2", title: "校園碳排地圖", excerpt: "六年級分組調查校內各區的用電熱點，用熱力圖標在校園平面圖上，找出可以省下來的角落。", tags: ["永續", "GIS", "校本課程"], author: { name: "鄭懷恩", school: "光復國小", color: "linear-gradient(135deg,#264653,#2A9D8F)" }, lights: 178, daysAgo: 6 },
    { id: "d-su3", title: "食物里程：今天的午餐走了多遠", excerpt: "翻菜單背面的供應商，孩子在地圖上連線，發現自己午餐的「累積飛行哩程」。", tags: ["永續", "食農教育", "地理"], author: { name: "黃子翔", school: "復興國小", color: "linear-gradient(135deg,#2A9D8F,#264653)" }, lights: 156, daysAgo: 9 },
    { id: "d-su4", title: "舊衣修補社：一條牛仔褲的第二人生", excerpt: "從一條學生捐出的牛仔褲開始，全班用拼布、繡線、手寫紙條一起修補。再轉送下一位。", tags: ["永續", "美感", "服務學習"], author: { name: "葉若萱", school: "蓬萊國小", color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)" }, lights: 142, daysAgo: 12 },
    { id: "d-su5", title: "校園小水庫：屋頂雨水的旅行", excerpt: "和總務處合作，把屋頂集水改造成洗手台一週的水。孩子用秤每天量一次，畫成折線圖。", tags: ["永續", "STEAM", "公民"], author: { name: "周明哲", school: "南屏國中", color: "linear-gradient(135deg,#F4A261,#E76F51)" }, lights: 121, daysAgo: 15 },
    { id: "d-su6", title: "把氣候新聞翻譯成國一聽得懂的話", excerpt: "每週給學生一篇英文氣候新聞，讓他們翻譯成「給五年級的版本」。練同理也練資訊判讀。", tags: ["永續", "雙語", "媒體素養"], author: { name: "林宛庭", school: "民和國小", color: "linear-gradient(135deg,#E9C46A,#E76F51)" }, lights: 98, daysAgo: 19 },
  ],
  energy: [
    { id: "d-e1", title: "一度電可以做什麼？", excerpt: "從家裡一張電費單開始，孩子把「一度電」換算成自己的滑手機分鐘數、煮泡麵碗數。", tags: ["能源", "生活換算", "數學"], author: { name: "蔡佳穎", school: "明德國小", color: "linear-gradient(135deg,#A8DADC,#457B9D)" }, lights: 165, daysAgo: 4 },
    { id: "d-e2", title: "風光電也有夜班嗎？", excerpt: "讓孩子畫出 24 小時的太陽 / 風 / 用電曲線，討論「為什麼半夜還是要燒煤」。", tags: ["能源", "再生能源", "公共議題"], author: { name: "周明哲", school: "南屏國中", color: "linear-gradient(135deg,#F4A261,#E76F51)" }, lights: 134, daysAgo: 7 },
    { id: "d-e3", title: "把學校頂樓變成太陽能模擬田", excerpt: "用紙板模型在頂樓量日照，計算如果鋪滿太陽能板，校內一週能省多少電費。", tags: ["能源", "STEAM", "校本課程"], author: { name: "黃子翔", school: "復興國小", color: "linear-gradient(135deg,#2A9D8F,#264653)" }, lights: 117, daysAgo: 10 },
    { id: "d-e4", title: "電池的一生", excerpt: "從買電池、用電池、丟電池，孩子畫一張「電池履歷」，思考為什麼回收這麼重要。", tags: ["能源", "永續", "資源循環"], author: { name: "鄭懷恩", school: "光復國小", color: "linear-gradient(135deg,#264653,#2A9D8F)" }, lights: 104, daysAgo: 13 },
    { id: "d-e5", title: "停電那天我們做了什麼", excerpt: "趁全縣大停電那天臨時改的課：用一根蠟燭聽故事，再寫下「沒有電的兩小時我感受到什麼」。", tags: ["能源", "情感教育", "敘事"], author: { name: "葉若萱", school: "蓬萊國小", color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)" }, lights: 211, daysAgo: 16 },
    { id: "d-e6", title: "用一台 USB 風扇談電壓電流", excerpt: "拆開、量電壓、改接電池，孩子發現「速度變慢」就懂了 V × I = P。", tags: ["能源", "物理", "實作"], author: { name: "林宛庭", school: "民和國中", color: "linear-gradient(135deg,#E9C46A,#E76F51)" }, lights: 89, daysAgo: 20 },
  ],
  aesthetic: [
    { id: "d-a1", title: "校園裡的 20 種灰", excerpt: "讓孩子帶色票走出教室，採集學校的灰：水泥、影子、雲、走廊瓷磚。回來貼成一張灰的詩。", tags: ["美感", "色彩", "在地走讀"], author: { name: "葉若萱", school: "蓬萊國小", color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)" }, lights: 198, daysAgo: 3 },
    { id: "d-a2", title: "字的氣味", excerpt: "讓孩子用不同的筆寫同一個字（媽、家、痛），討論為什麼字會「長得不一樣的味道」。", tags: ["美感", "國語", "字形"], author: { name: "林宛庭", school: "民和國小", color: "linear-gradient(135deg,#E9C46A,#E76F51)" }, lights: 152, daysAgo: 6 },
    { id: "d-a3", title: "拍下三秒鐘的安靜", excerpt: "請學生用手機拍下校園裡最安靜的三秒鐘。最後合成一支兩分鐘的「校園靜物片」。", tags: ["美感", "影像", "聲音"], author: { name: "蔡佳穎", school: "明德國小", color: "linear-gradient(135deg,#A8DADC,#457B9D)" }, lights: 137, daysAgo: 9 },
    { id: "d-a4", title: "把午餐擺成靜物畫", excerpt: "午餐前花兩分鐘擺盤，拍照，再吃。一週後選出全班的「午餐靜物畫」展。", tags: ["美感", "食農", "影像"], author: { name: "鄭懷恩", school: "光復國小", color: "linear-gradient(135deg,#264653,#2A9D8F)" }, lights: 121, daysAgo: 12 },
    { id: "d-a5", title: "招牌田野調查", excerpt: "走出校門 100 公尺，紀錄看到的所有招牌字體。回來分組討論：哪種字最讓你想進門？", tags: ["美感", "字體", "走讀"], author: { name: "周明哲", school: "南屏國中", color: "linear-gradient(135deg,#F4A261,#E76F51)" }, lights: 109, daysAgo: 15 },
    { id: "d-a6", title: "一張紙能折幾種情緒", excerpt: "同樣的 A4，讓孩子用「揉、撕、折、捏」表達四種情緒，貼在牆上組成情緒地圖。", tags: ["美感", "情感教育", "造形"], author: { name: "黃子翔", school: "復興國小", color: "linear-gradient(135deg,#2A9D8F,#264653)" }, lights: 87, daysAgo: 18 },
  ],
  bilingual: [
    { id: "d-b1", title: "Bilingual Lunch Menu", excerpt: "讓孩子當一週的「中英文菜單翻譯員」，把學校菜單翻成英文，貼在餐廳門口。", tags: ["雙語", "食農", "實作翻譯"], author: { name: "蔡佳穎", school: "明德國小", color: "linear-gradient(135deg,#A8DADC,#457B9D)" }, lights: 188, daysAgo: 2 },
    { id: "d-b2", title: "用英文吵架的科學課", excerpt: "和自然老師共備：學生用簡單英文辯論「冰塊融化的速度」。練的是 claim / evidence / reason。", tags: ["雙語", "自然", "CLIL"], author: { name: "周明哲", school: "南屏國中", color: "linear-gradient(135deg,#F4A261,#E76F51)" }, lights: 162, daysAgo: 5 },
    { id: "d-b3", title: "校園英文標示重新設計", excerpt: "讓六年級走校園找錯誤或彆扭的英文標示，重新設計一版送給總務處。", tags: ["雙語", "美感", "服務學習"], author: { name: "鄭懷恩", school: "光復國小", color: "linear-gradient(135deg,#264653,#2A9D8F)" }, lights: 144, daysAgo: 8 },
    { id: "d-b4", title: "Podcast 90 秒：說一個校園故事", excerpt: "孩子用 90 秒英文錄一段校園小故事。同學互聽，給彼此「聽得懂幾成」的回饋。", tags: ["雙語", "口語", "敘事"], author: { name: "葉若萱", school: "蓬萊國小", color: "linear-gradient(135deg,#BDB2FF,#FFC6FF)" }, lights: 128, daysAgo: 11 },
    { id: "d-b5", title: "雙語社會課：地圖上的台灣", excerpt: "和社會老師合上一節課：用英文標出台灣，再用台語介紹自己家鄉的一個地名。", tags: ["雙語", "社會", "在地"], author: { name: "林宛庭", school: "民和國小", color: "linear-gradient(135deg,#E9C46A,#E76F51)" }, lights: 116, daysAgo: 14 },
    { id: "d-b6", title: "翻譯一首流行歌", excerpt: "讓孩子挑一首自己最愛的英文歌，翻成「能唱的中文版」。練的是 rhythm 和選詞。", tags: ["雙語", "音樂", "創作"], author: { name: "黃子翔", school: "復興國小", color: "linear-gradient(135deg,#2A9D8F,#264653)" }, lights: 98, daysAgo: 17 },
  ],
};

function DiscoverHub() {
  const [topicId, setTopicId] = useStateDH("semi");
  const topic = TOPICS.find((t) => t.id === topicId);
  const ideas = DISCOVER_IDEAS[topicId] || [];

  return (
    <div>
      {/* TOPIC PILLS */}
      <div className="sticky top-[60px] z-20 bg-[rgba(250,250,247,0.88)] backdrop-blur-md border-b border-[#ECECE6]">
        <div className="max-w-[1280px] mx-auto px-8 h-[68px] flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9C9C95] font-mono pr-3 border-r border-[#ECECE6] h-7">
            <FilterIcon size={11}/>
            主題策展
          </div>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pr-6">
              {TOPICS.map((t) => {
                const active = t.id === topicId;
                const Ic = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTopicId(t.id)}
                    className={`relative shrink-0 group flex items-center gap-2 h-9 pl-3 pr-3.5 rounded-full transition-all duration-300 ${
                      active
                        ? "bg-[#18181B] text-white shadow-[0_8px_22px_-12px_rgba(24,24,27,0.55)]"
                        : "bg-white text-[#18181B] border border-[#ECECE6] hover:border-[#18181B]/30 hover:bg-[#FAFAF5]"
                    }`}
                    style={active ? { boxShadow: `0 8px 22px -12px ${t.accent}99, inset 0 0 0 1px rgba(255,255,255,0.06)` } : {}}
                  >
                    <Ic
                      size={13}
                      strokeWidth={1.5}
                      className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}
                      style={active ? { color: t.accent } : { color: "#5C5C58" }}
                    />
                    <span className="text-[12.5px] font-medium tracking-tight">{t.name}</span>
                    <span className={`text-[10.5px] font-mono tabular-nums ${active ? "text-white/55" : "text-[#9C9C95]"}`}>
                      {t.count}
                    </span>
                  </button>
                );
              })}
              <div className="shrink-0 w-px h-5 bg-[#ECECE6] mx-1"></div>
              <button className="shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-full text-[12px] text-[#7A7A74] border border-dashed border-[#D9D9D2] hover:border-[#9C9C95] hover:text-[#18181B] transition-colors">
                <PlusIcon size={11}/>
                提案主題
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <TopicHero topic={topic} />

      {/* GRID + PULSE */}
      <section className="max-w-[1280px] mx-auto px-8 pb-32">
        <div className="grid grid-cols-[1fr_280px] gap-10">
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-[18px] font-medium tracking-tight">
                  自動彙整 · {topic.count} 個帶有「{topic.name}」標籤的點子
                </h2>
                <div className="text-[12px] text-[#9C9C95] mt-1">
                  Teach Different 每天清晨自動掃描並彙整一次。
                </div>
              </div>
              <div className="flex items-center gap-1 text-[12px]">
                <button className="px-2.5 h-7 rounded-md bg-[#18181B]/[0.05] text-[#18181B]">最熱燈數</button>
                <button className="px-2.5 h-7 rounded-md text-[#7A7A74] hover:text-[#18181B]">最近實踐</button>
                <button className="px-2.5 h-7 rounded-md text-[#7A7A74] hover:text-[#18181B]">最新衍生</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ideas.map((idea) => (
                <DiscoverCard key={idea.id} idea={idea} topic={topic} />
              ))}
            </div>
          </div>
          <aside className="relative">
            <div className="sticky top-[152px] flex flex-col gap-4">
              <PulseCard topic={topic}/>
              <RelatedTopics current={topic}/>
              <CallToShare topic={topic}/>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function TopicHero({ topic }) {
  const Ic = topic.icon;
  return (
    <section className="border-b border-[#ECECE6]">
      <div className="max-w-[1280px] mx-auto px-8 py-16 grid grid-cols-[1fr_360px] gap-10 items-end">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.18em] uppercase text-[#9C9C95] mb-5">
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: topic.accentSoft, color: topic.accent }}
            >
              <Ic size={11} strokeWidth={1.7}/>
              {topic.en}
            </span>
            <span>策展主題</span>
            <span>·</span>
            <span>本週共 {topic.count} 筆</span>
          </div>

          <h1
            key={topic.id}
            className="text-[44px] leading-[1.18] tracking-tight font-medium text-[#18181B] discover-hero-text"
            style={{ textWrap: "balance", whiteSpace: "pre-line" }}
          >
            {topic.hero}
          </h1>

          <p
            className="mt-5 text-[15px] leading-[1.7] text-[#5C5C58] max-w-[560px]"
            style={{ fontFamily: "'Noto Serif TC',serif", fontStyle: "italic" }}
          >
            {topic.sub}
          </p>

          <div className="mt-7 flex items-center gap-3">
            <button
              className="h-9 px-4 rounded-md text-white text-[12.5px] font-medium transition-all hover:brightness-110"
              style={{ background: topic.accent, boxShadow: `0 8px 20px -12px ${topic.accent}` }}
            >
              加入這個主題策展
            </button>
            <button className="h-9 px-4 rounded-md text-[#18181B] text-[12.5px] border border-[#ECECE6] hover:bg-[#FAFAF5] transition-colors">
              訂閱新點子
            </button>
            <div className="text-[11px] text-[#9C9C95] font-mono ml-2">
              已有 {topic.pulse.teachers} 位老師加入
            </div>
          </div>
        </div>

        <div className="relative h-[200px] hidden lg:block">
          <HeroOrnament topic={topic}/>
        </div>
      </div>
    </section>
  );
}

function HeroOrnament({ topic }) {
  const Ic = topic.icon;
  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${topic.accentSoft} 0%, #FAFAF7 100%)` }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(24,24,27,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div className="absolute right-6 bottom-4" style={{ color: topic.accent, opacity: 0.18 }}>
          <Ic size={140} strokeWidth={1}/>
        </div>
        <div className="absolute top-5 left-5 right-5">
          <div className="text-[10.5px] font-mono tracking-[0.18em] uppercase" style={{ color: topic.accent }}>
            now showing
          </div>
          <div className="mt-1 text-[20px] font-medium tracking-tight text-[#18181B]">
            {topic.name} · {topic.en}
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] font-mono text-[#5C5C58]">
          <span>updated · 06:00</span>
          <span>cur. by {topic.pulse.teachers} 老師</span>
        </div>
      </div>
    </div>
  );
}

function DiscoverCard({ idea, topic }) {
  return (
    <div className="rounded-xl border border-[#ECECE6] bg-white p-5 hover:border-[#D6D6CE] hover:-translate-y-[2px] hover:shadow-[0_18px_40px_-30px_rgba(24,24,27,0.35)] transition-all duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {idea.tags.map((tag) => {
            const hot = tag === topic.name;
            return (
              <span
                key={tag}
                className={`text-[10.5px] font-mono px-1.5 py-0.5 rounded transition-colors ${hot ? "font-medium" : "text-[#7A7A74] bg-[#F2F2EC]"}`}
                style={hot ? { background: topic.accentSoft, color: topic.accent } : {}}
              >
                #{tag}
              </span>
            );
          })}
        </div>
        <div className="text-[10.5px] text-[#9C9C95] font-mono">{idea.daysAgo}d</div>
      </div>

      <h3 className="mt-4 text-[16px] tracking-tight font-medium text-[#18181B] leading-[1.4]">
        {idea.title}
      </h3>
      <p className="mt-2 text-[12.5px] leading-[1.6] text-[#5C5C58] line-clamp-3">
        {idea.excerpt}
      </p>

      <div className="flex-1"></div>

      <div className="mt-5 pt-3.5 border-t border-[#F0F0EA] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
            style={{ background: idea.author.color }}
          >
            {idea.author.name[0]}
          </div>
          <div className="leading-tight">
            <div className="text-[11.5px] text-[#18181B]">{idea.author.name}</div>
            <div className="text-[10px] text-[#9C9C95]">{idea.author.school}</div>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-[#7A7A74] font-mono tabular-nums">
          <FlameIcon size={11} className="text-[#E89B3C]"/>
          {idea.lights}
        </span>
      </div>
    </div>
  );
}

function PulseCard({ topic }) {
  return (
    <div className="rounded-xl bg-[#FCFBF5] border border-[#ECECE6] p-5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-mono tracking-[0.18em] uppercase text-[#9C9C95]">
        <span className="relative inline-block w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full bg-[#E89B3C]"></span>
          <span className="absolute inset-0 rounded-full bg-[#E89B3C] animate-ping opacity-60"></span>
        </span>
        cross-disciplinary pulse
      </div>
      <p className="mt-4 text-[14.5px] leading-[1.65] text-[#18181B]" style={{ fontFamily: "'Noto Serif TC',serif" }}>
        目前有{" "}
        <span className="font-medium not-italic" style={{ color: topic.accent }}>
          {topic.pulse.teachers} 位
        </span>
        老師正在共同備課這個主題 ──
      </p>
      <ul className="mt-4 space-y-2.5">
        {topic.pulse.subjects.map((s, i) => (
          <li key={s} className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2 text-[#3C3C38]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: topic.accent, opacity: 0.4 + i * 0.2 }}></span>
              {s}老師
            </div>
            <span className="text-[#9C9C95] font-mono tabular-nums whitespace-nowrap">
              {[3, 1, 2, 1][i] || 1} 位
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-[#ECECE6] flex items-center justify-between text-[11px] text-[#7A7A74]">
        <span className="flex items-center gap-1.5">
          <SchoolIcon size={11}/>
          來自 {topic.pulse.schools} 所學校
        </span>
        <button className="text-[#18181B] hover:underline underline-offset-2">看共備</button>
      </div>
    </div>
  );
}

function RelatedTopics({ current }) {
  const others = TOPICS.filter((t) => t.id !== current.id).slice(0, 3);
  return (
    <div className="rounded-xl border border-[#ECECE6] bg-white p-5">
      <div className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-[#9C9C95] mb-3">相關主題</div>
      <ul className="space-y-2.5">
        {others.map((t) => {
          const Ic = t.icon;
          return (
            <li key={t.id}>
              <a href="#" className="flex items-center gap-2.5 group">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                  style={{ background: t.accentSoft, color: t.accent }}
                >
                  <Ic size={13} strokeWidth={1.7}/>
                </div>
                <div className="flex-1">
                  <div className="text-[12.5px] text-[#18181B] group-hover:underline underline-offset-2">{t.name}</div>
                  <div className="text-[10.5px] text-[#9C9C95]">{t.count} 個點子</div>
                </div>
                <TrendIcon size={11} className="text-[#C5C5BE] group-hover:text-[#18181B] transition-colors"/>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CallToShare({ topic }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D9D9D2] p-5">
      <div className="flex items-center gap-2 mb-2">
        <FeatherIcon size={13} className="text-[#9C9C95]"/>
        <div className="text-[11.5px] text-[#5C5C58]">你有「{topic.name}」的點子嗎？</div>
      </div>
      <p className="text-[11.5px] leading-[1.6] text-[#9C9C95]">
        分享一個小實驗，就能被其他正在共備的老師看見。
      </p>
      <button className="mt-3 w-full h-8 rounded-md bg-[#18181B] text-white text-[11.5px] font-medium hover:bg-[#2A2A2E] transition-colors">
        加入這個主題
      </button>
    </div>
  );
}

export default DiscoverHub;
