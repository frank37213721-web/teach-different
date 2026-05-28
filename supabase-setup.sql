-- ================================================================
-- Teach Different · Supabase 資料庫設定
-- 在 Supabase → SQL Editor 貼上全部執行
-- ================================================================

-- ── ideas 表 ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ideas (
  id              TEXT PRIMARY KEY,
  subject         TEXT NOT NULL,
  grade           TEXT NOT NULL,
  education_level TEXT NOT NULL,          -- '國小' | '國中' | '高中'
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL,
  author_name     TEXT NOT NULL,
  author_school   TEXT NOT NULL,
  author_color    TEXT NOT NULL,
  forked_from_name   TEXT,
  forked_from_commit TEXT,
  lights      INTEGER DEFAULT 0  NOT NULL,
  practices   INTEGER DEFAULT 0  NOT NULL,
  week_lights INTEGER DEFAULT 0  NOT NULL,
  tags        TEXT[]  DEFAULT '{}' NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ideas are publicly readable" ON ideas;
CREATE POLICY "ideas are publicly readable" ON ideas FOR SELECT USING (true);

-- ── profiles 表 ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  school          TEXT,
  primary_subject TEXT,
  subjects        TEXT[] DEFAULT '{}',    -- 訂閱的科目
  levels          TEXT[] DEFAULT '{}',    -- ['國小','國中','高中']
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles owner select" ON profiles;
DROP POLICY IF EXISTS "profiles owner insert" ON profiles;
DROP POLICY IF EXISTS "profiles owner update" ON profiles;
CREATE POLICY "profiles owner select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles owner insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles owner update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── 種子資料（10 筆）──────────────────────────────────────────────
INSERT INTO ideas
  (id, subject, grade, education_level, title, excerpt,
   author_name, author_school, author_color,
   forked_from_name, forked_from_commit,
   lights, practices, week_lights, tags, published_at)
VALUES
(
  'i01','國語','五年級','國小',
  '用便利貼演化一篇作文',
  '讓孩子先在牆上寫下一句話，下一位同學再用便利貼蓋掉並替換它。整堂課就是一篇文章的「修訂歷史」。',
  '林宛庭','民和國小','linear-gradient(135deg,#E9C46A,#E76F51)',
  '陳秀蓮','f3a91c',
  142,38,28,ARRAY['#寫作教學','#協作學習','#修訂歷史'],NOW()-INTERVAL'3 days'
),(
  'i02','數學','六年級','國小',
  '走廊地磚變身座標平面',
  '把走廊當成一個 12×6 的卡式座標系。學生輪流當「點」，老師喊出座標，被點到的人要快速跑到位置。',
  '黃子翔','復興國小','linear-gradient(135deg,#2A9D8F,#264653)',
  NULL,NULL,
  87,22,12,ARRAY['#數學遊戲','#座標系','#戶外教學'],NOW()-INTERVAL'5 days'
),(
  'i03','自然','三年級','國小',
  '下雨天的微氣象觀察',
  '下雨那天臨時改成「雨滴觀察會」。一人發一張黑色紙片，伸出走廊，回來用放大鏡計算每平方公分的雨滴痕跡。',
  '蔡佳穎','明德國小','linear-gradient(135deg,#A8DADC,#457B9D)',
  '蔡佳穎','92cf04',
  211,64,45,ARRAY['#自然觀察','#氣象教學','#戶外學習'],NOW()-INTERVAL'1 day'
),(
  'i04','社會','五年級','國小',
  '讓學生當主播報歷史',
  '把朝代興替包裝成晚間新聞。學生分組挑一個事件，準備 90 秒口播稿，用手機錄一段「歷史晚間新聞」。',
  '周明哲','南屏國中','linear-gradient(135deg,#F4A261,#E76F51)',
  '林宛庭','a01e7d',
  96,19,8,ARRAY['#歷史教學','#口語表達','#創意教學'],NOW()-INTERVAL'8 days'
),(
  'i05','音樂','四年級','國小',
  '節奏就是程式語言',
  '用「ㄉㄤ／ㄎㄎ／休止」三個字寫一段 16 拍節奏譜，再讓另一組學生用身體動作「解析執行」。',
  '葉若萱','蓬萊國小','linear-gradient(135deg,#BDB2FF,#FFC6FF)',
  NULL,NULL,
  54,11,5,ARRAY['#音樂教育','#節奏訓練','#跨域學習'],NOW()-INTERVAL'12 days'
),(
  'i06','綜合','六年級','國小',
  '畢業前的「校園小事典」',
  '請每位學生提名一件「只有我們這屆才懂」的小事，匿名投票後做成 A4 風格的辭典頁。送給下一屆。',
  '鄭懷恩','光復國小','linear-gradient(135deg,#264653,#2A9D8F)',
  '黃子翔','c47b21',
  318,102,52,ARRAY['#畢業活動','#班級凝聚','#創意製作'],NOW()-INTERVAL'14 days'
),(
  'i07','物理','高中二年級','高中',
  '用果凍捏出 PN 接面',
  '兩色果凍分別代表 N 型與 P 型半導體，學生用手指把「多數載子」往中間推，直到推不動的那條線，就是空乏區。比投影片直觀十倍。',
  '吳承翰','建國高中','linear-gradient(135deg,#0077B6,#023E8A)',
  NULL,NULL,
  74,21,18,ARRAY['#半導體','#PN接面','#動手實驗'],NOW()-INTERVAL'2 days'
),(
  'i08','物理','高中一年級','高中',
  'LED 光譜反推禁帶寬度',
  '每組拿一片光柵片對著不同顏色 LED 觀察光譜，記錄峰值波長，換算光子能量。最後比對理論禁帶寬度，誤差在 5% 內的組別有小獎勵。',
  '陳柏宇','師大附中','linear-gradient(135deg,#F77F00,#D62828)',
  '吳承翰','e81d3f',
  112,33,22,ARRAY['#光學','#半導體','#實驗教學'],NOW()-INTERVAL'6 days'
),(
  'i09','化學','高中一年級','高中',
  '從沙子到晶片：矽的鍵結旅行',
  '帶一包海沙進教室。從 SiO₂ 的共價鍵出發，一步步走到純矽、摻雜、再到 N 型與 P 型。最後讓學生計算：這包沙能做幾顆晶片？',
  '林雅涵','北一女中','linear-gradient(135deg,#40916C,#1B4332)',
  NULL,NULL,
  89,28,15,ARRAY['#化學鍵結','#半導體','#跨域連結'],NOW()-INTERVAL'9 days'
),(
  'i10','自然科學','高中三年級','高中',
  '製程節點縮放：人體比例尺',
  '把一根頭髮（約 70µm）投影在黑板上，讓學生用尺算出 7nm 節點在上面有多細。再算一顆 M1 晶片裡 160 億顆電晶體排成一排有多長。數字讓人起雞皮疙瘩。',
  '張智翔','中山女高','linear-gradient(135deg,#7B2D8B,#4A0E6E)',
  '林雅涵','b52a9c',
  156,47,38,ARRAY['#製程節點','#半導體','#數感教育'],NOW()-INTERVAL'4 days'
)
ON CONFLICT (id) DO NOTHING;
