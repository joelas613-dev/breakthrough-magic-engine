// UI translations for Prodigy. Keep keys stable; add languages as needed.

export type LangCode =
  | "en" | "he" | "ar" | "es" | "fr" | "de" | "pt" | "ru"
  | "zh" | "ja" | "ko" | "hi" | "it" | "tr" | "nl";

export const LANGUAGES: { code: LangCode; label: string; nativeLabel: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English",     nativeLabel: "English",    flag: "🇺🇸", dir: "ltr" },
  { code: "he", label: "Hebrew",      nativeLabel: "עברית",       flag: "🇮🇱", dir: "rtl" },
  { code: "ar", label: "Arabic",      nativeLabel: "العربية",      flag: "🇸🇦", dir: "rtl" },
  { code: "es", label: "Spanish",     nativeLabel: "Español",    flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "French",      nativeLabel: "Français",   flag: "🇫🇷", dir: "ltr" },
  { code: "de", label: "German",      nativeLabel: "Deutsch",    flag: "🇩🇪", dir: "ltr" },
  { code: "pt", label: "Portuguese",  nativeLabel: "Português",  flag: "🇧🇷", dir: "ltr" },
  { code: "it", label: "Italian",     nativeLabel: "Italiano",   flag: "🇮🇹", dir: "ltr" },
  { code: "nl", label: "Dutch",       nativeLabel: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "ru", label: "Russian",     nativeLabel: "Русский",    flag: "🇷🇺", dir: "ltr" },
  { code: "tr", label: "Turkish",     nativeLabel: "Türkçe",     flag: "🇹🇷", dir: "ltr" },
  { code: "zh", label: "Chinese",     nativeLabel: "中文",         flag: "🇨🇳", dir: "ltr" },
  { code: "ja", label: "Japanese",    nativeLabel: "日本語",       flag: "🇯🇵", dir: "ltr" },
  { code: "ko", label: "Korean",      nativeLabel: "한국어",       flag: "🇰🇷", dir: "ltr" },
  { code: "hi", label: "Hindi",       nativeLabel: "हिन्दी",         flag: "🇮🇳", dir: "ltr" },
];

export const LANGUAGE_NAMES: Record<LangCode, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l.label]),
) as Record<LangCode, string>;

export function isRtl(code: string): boolean {
  return LANGUAGES.find((l) => l.code === code)?.dir === "rtl";
}

export function normalizeLang(code: string | null | undefined): LangCode {
  if (!code) return "en";
  const c = code.toLowerCase().slice(0, 2);
  return (LANGUAGES.find((l) => l.code === c)?.code ?? "en") as LangCode;
}

type Dict = {
  newSession: string;
  sessions: string;
  stuckTopics: string;
  noSessions: string;
  profile: string;
  setGrade: string;
  signOut: string;
  whatLearn: string;
  pickSubject: string;
  askAnything: string;
  tutorThinking: string;
  askPlaceholder: string;
  studentProfile: string;
  profileHint: string;
  name: string;
  namePh: string;
  grade: string;
  gradePh: string;
  defaultLang: string;
  language: string;
  cancel: string;
  save: string;
  saved: string;
  freeLimit: string;
  upgrade: string;
  freeRemaining: (n: number) => string;
  freeExhausted: string;
  math: string;
  physics: string;
  writing: string;
  code: string;
};

const en: Dict = {
  newSession: "New session",
  sessions: "Sessions",
  stuckTopics: "Stuck topics",
  noSessions: "No sessions yet",
  profile: "Profile",
  setGrade: "Set grade",
  signOut: "Sign out",
  whatLearn: "What do you want to learn?",
  pickSubject: "Pick a subject and I'll start a fresh session. Everything auto-saves.",
  askAnything: "Ask me anything.",
  tutorThinking: "Tutor is thinking…",
  askPlaceholder: "Ask a question or show what you tried…",
  studentProfile: "Student profile",
  profileHint: "The tutor uses this to adapt tone and level.",
  name: "Name",
  namePh: "Ada",
  grade: "Grade / level",
  gradePh: "7th grade",
  defaultLang: "Default language",
  language: "Language",
  cancel: "Cancel",
  save: "Save",
  saved: "Saved",
  freeLimit: "You hit the 3-message daily free limit. Upgrade to keep going.",
  upgrade: "Upgrade",
  freeRemaining: (n) => `${n} free ${n === 1 ? "message" : "messages"} left today`,
  freeExhausted: "Free daily limit reached — upgrade for unlimited",
  math: "Math", physics: "Physics", writing: "Writing", code: "Code",
};

const he: Dict = {
  newSession: "התחל שיחה",
  sessions: "היסטוריה",
  stuckTopics: "נושאים תקועים",
  noSessions: "אין שיחות עדיין",
  profile: "פרופיל",
  setGrade: "לא הוגדרה כיתה",
  signOut: "התנתק",
  whatLearn: "במה תרצה ללמוד היום?",
  pickSubject: "בחר מקצוע ואני אתחיל שיחה חדשה. הכל נשמר אוטומטית.",
  askAnything: "שאל אותי כל דבר.",
  tutorThinking: "המורה חושב…",
  askPlaceholder: "שאל שאלה או הראה מה ניסית…",
  studentProfile: "פרופיל התלמיד",
  profileHint: "המורה משתמש בזה כדי להתאים את השפה והרמה.",
  name: "שם",
  namePh: "עדה",
  grade: "כיתה / רמה",
  gradePh: "כיתה ז'",
  defaultLang: "שפת ברירת מחדל",
  language: "שפה",
  cancel: "ביטול",
  save: "שמור",
  saved: "נשמר",
  freeLimit: "הגעת למגבלת 3 הודעות ליום. שדרג להמשך.",
  upgrade: "שדרג",
  freeRemaining: (n) => `נותרו ${n} הודעות חינם היום`,
  freeExhausted: "הגעת למגבלה היומית — שדרג לשימוש ללא הגבלה",
  math: "מתמטיקה", physics: "פיזיקה", writing: "כתיבה", code: "קוד",
};

const ar: Dict = {
  newSession: "جلسة جديدة", sessions: "الجلسات", stuckTopics: "مواضيع عالقة",
  noSessions: "لا توجد جلسات بعد", profile: "الملف الشخصي", setGrade: "حدّد الصف",
  signOut: "تسجيل الخروج", whatLearn: "ماذا تريد أن تتعلّم؟",
  pickSubject: "اختر مادة وسأبدأ جلسة جديدة. كل شيء يُحفظ تلقائيًا.",
  askAnything: "اسألني أي شيء.", tutorThinking: "المعلّم يفكّر…",
  askPlaceholder: "اطرح سؤالاً أو أرِني ما جرّبت…",
  studentProfile: "ملف الطالب", profileHint: "يستخدم المعلّم هذا لضبط الأسلوب والمستوى.",
  name: "الاسم", namePh: "علي", grade: "الصف / المستوى", gradePh: "الصف السابع",
  defaultLang: "اللغة الافتراضية", language: "اللغة",
  cancel: "إلغاء", save: "حفظ", saved: "تم الحفظ",
  freeLimit: "لقد وصلت إلى حد 3 رسائل مجانية يوميًا. قم بالترقية للمتابعة.",
  upgrade: "ترقية",
  freeRemaining: (n) => `تبقّت ${n} رسائل مجانية اليوم`,
  freeExhausted: "وصلت إلى الحد اليومي المجاني — قم بالترقية للاستخدام غير المحدود",
  math: "رياضيات", physics: "فيزياء", writing: "كتابة", code: "برمجة",
};

const es: Dict = {
  newSession: "Nueva sesión", sessions: "Sesiones", stuckTopics: "Temas atascados",
  noSessions: "Aún no hay sesiones", profile: "Perfil", setGrade: "Define el curso",
  signOut: "Cerrar sesión", whatLearn: "¿Qué quieres aprender hoy?",
  pickSubject: "Elige una materia y comenzaré una sesión nueva. Todo se guarda solo.",
  askAnything: "Pregúntame lo que quieras.", tutorThinking: "El tutor está pensando…",
  askPlaceholder: "Haz una pregunta o muéstrame lo que intentaste…",
  studentProfile: "Perfil del estudiante", profileHint: "El tutor lo usa para ajustar el tono y el nivel.",
  name: "Nombre", namePh: "Ada", grade: "Curso / nivel", gradePh: "7.º grado",
  defaultLang: "Idioma por defecto", language: "Idioma",
  cancel: "Cancelar", save: "Guardar", saved: "Guardado",
  freeLimit: "Alcanzaste el límite gratis de 3 mensajes al día. Mejora tu plan para continuar.",
  upgrade: "Mejorar",
  freeRemaining: (n) => `Te quedan ${n} mensajes gratis hoy`,
  freeExhausted: "Alcanzaste el límite diario gratuito — mejora para uso ilimitado",
  math: "Matemáticas", physics: "Física", writing: "Escritura", code: "Código",
};

const fr: Dict = {
  newSession: "Nouvelle session", sessions: "Sessions", stuckTopics: "Sujets bloquants",
  noSessions: "Aucune session pour l'instant", profile: "Profil", setGrade: "Définir le niveau",
  signOut: "Se déconnecter", whatLearn: "Que veux-tu apprendre aujourd'hui ?",
  pickSubject: "Choisis une matière et je démarre une nouvelle session. Tout est enregistré automatiquement.",
  askAnything: "Pose-moi n'importe quelle question.", tutorThinking: "Le tuteur réfléchit…",
  askPlaceholder: "Pose une question ou montre ce que tu as essayé…",
  studentProfile: "Profil de l'élève", profileHint: "Le tuteur s'en sert pour adapter le ton et le niveau.",
  name: "Nom", namePh: "Ada", grade: "Classe / niveau", gradePh: "5e",
  defaultLang: "Langue par défaut", language: "Langue",
  cancel: "Annuler", save: "Enregistrer", saved: "Enregistré",
  freeLimit: "Tu as atteint la limite gratuite de 3 messages par jour. Passe à un plan pour continuer.",
  upgrade: "Améliorer",
  freeRemaining: (n) => `Il te reste ${n} messages gratuits aujourd'hui`,
  freeExhausted: "Limite quotidienne atteinte — passe à un plan pour un usage illimité",
  math: "Maths", physics: "Physique", writing: "Écriture", code: "Code",
};

const de: Dict = {
  newSession: "Neue Sitzung", sessions: "Sitzungen", stuckTopics: "Schwierige Themen",
  noSessions: "Noch keine Sitzungen", profile: "Profil", setGrade: "Klasse festlegen",
  signOut: "Abmelden", whatLearn: "Was möchtest du heute lernen?",
  pickSubject: "Wähle ein Fach — ich starte eine neue Sitzung. Alles wird automatisch gespeichert.",
  askAnything: "Frag mich alles.", tutorThinking: "Der Tutor denkt nach…",
  askPlaceholder: "Stell eine Frage oder zeig, was du versucht hast…",
  studentProfile: "Schülerprofil", profileHint: "Der Tutor passt damit Ton und Niveau an.",
  name: "Name", namePh: "Ada", grade: "Klasse / Niveau", gradePh: "7. Klasse",
  defaultLang: "Standardsprache", language: "Sprache",
  cancel: "Abbrechen", save: "Speichern", saved: "Gespeichert",
  freeLimit: "Du hast das kostenlose Tageslimit von 3 Nachrichten erreicht. Bitte upgraden.",
  upgrade: "Upgraden",
  freeRemaining: (n) => `Noch ${n} kostenlose Nachrichten heute`,
  freeExhausted: "Tageslimit erreicht — Upgrade für unbegrenzte Nutzung",
  math: "Mathe", physics: "Physik", writing: "Schreiben", code: "Programmieren",
};

const pt: Dict = {
  newSession: "Nova sessão", sessions: "Sessões", stuckTopics: "Tópicos difíceis",
  noSessions: "Nenhuma sessão ainda", profile: "Perfil", setGrade: "Definir a série",
  signOut: "Sair", whatLearn: "O que você quer aprender hoje?",
  pickSubject: "Escolha uma matéria e eu começo uma nova sessão. Tudo é salvo automaticamente.",
  askAnything: "Pergunte qualquer coisa.", tutorThinking: "O tutor está pensando…",
  askPlaceholder: "Faça uma pergunta ou mostre o que tentou…",
  studentProfile: "Perfil do aluno", profileHint: "O tutor usa isto para ajustar o tom e o nível.",
  name: "Nome", namePh: "Ada", grade: "Série / nível", gradePh: "7.º ano",
  defaultLang: "Idioma padrão", language: "Idioma",
  cancel: "Cancelar", save: "Salvar", saved: "Salvo",
  freeLimit: "Você atingiu o limite gratuito de 3 mensagens por dia. Faça upgrade para continuar.",
  upgrade: "Fazer upgrade",
  freeRemaining: (n) => `Restam ${n} mensagens grátis hoje`,
  freeExhausted: "Limite diário atingido — faça upgrade para uso ilimitado",
  math: "Matemática", physics: "Física", writing: "Redação", code: "Código",
};

const it: Dict = {
  newSession: "Nuova sessione", sessions: "Sessioni", stuckTopics: "Argomenti bloccanti",
  noSessions: "Ancora nessuna sessione", profile: "Profilo", setGrade: "Imposta la classe",
  signOut: "Esci", whatLearn: "Cosa vuoi imparare oggi?",
  pickSubject: "Scegli una materia e avvio una nuova sessione. Tutto viene salvato in automatico.",
  askAnything: "Chiedimi qualsiasi cosa.", tutorThinking: "Il tutor sta pensando…",
  askPlaceholder: "Fai una domanda o mostrami cosa hai provato…",
  studentProfile: "Profilo dello studente", profileHint: "Il tutor lo usa per adattare tono e livello.",
  name: "Nome", namePh: "Ada", grade: "Classe / livello", gradePh: "2ª media",
  defaultLang: "Lingua predefinita", language: "Lingua",
  cancel: "Annulla", save: "Salva", saved: "Salvato",
  freeLimit: "Hai raggiunto il limite gratuito di 3 messaggi al giorno. Passa a un piano per continuare.",
  upgrade: "Passa a Pro",
  freeRemaining: (n) => `Ti restano ${n} messaggi gratis oggi`,
  freeExhausted: "Limite giornaliero raggiunto — passa a un piano per un uso illimitato",
  math: "Matematica", physics: "Fisica", writing: "Scrittura", code: "Programmazione",
};

const nl: Dict = {
  newSession: "Nieuwe sessie", sessions: "Sessies", stuckTopics: "Lastige onderwerpen",
  noSessions: "Nog geen sessies", profile: "Profiel", setGrade: "Stel je klas in",
  signOut: "Uitloggen", whatLearn: "Wat wil je vandaag leren?",
  pickSubject: "Kies een vak en ik start een nieuwe sessie. Alles wordt automatisch bewaard.",
  askAnything: "Vraag me alles.", tutorThinking: "De tutor denkt na…",
  askPlaceholder: "Stel een vraag of laat zien wat je hebt geprobeerd…",
  studentProfile: "Leerlingprofiel", profileHint: "De tutor gebruikt dit om toon en niveau aan te passen.",
  name: "Naam", namePh: "Ada", grade: "Klas / niveau", gradePh: "Groep 8",
  defaultLang: "Standaardtaal", language: "Taal",
  cancel: "Annuleren", save: "Opslaan", saved: "Opgeslagen",
  freeLimit: "Je hebt de gratis limiet van 3 berichten per dag bereikt. Upgrade om door te gaan.",
  upgrade: "Upgraden",
  freeRemaining: (n) => `Nog ${n} gratis berichten vandaag`,
  freeExhausted: "Daglimiet bereikt — upgrade voor onbeperkt gebruik",
  math: "Wiskunde", physics: "Natuurkunde", writing: "Schrijven", code: "Code",
};

const ru: Dict = {
  newSession: "Новая сессия", sessions: "Сессии", stuckTopics: "Сложные темы",
  noSessions: "Пока нет сессий", profile: "Профиль", setGrade: "Укажи класс",
  signOut: "Выйти", whatLearn: "Что хочешь изучить сегодня?",
  pickSubject: "Выбери предмет — я начну новую сессию. Всё сохраняется автоматически.",
  askAnything: "Спроси что угодно.", tutorThinking: "Наставник думает…",
  askPlaceholder: "Задай вопрос или покажи, что ты пробовал…",
  studentProfile: "Профиль ученика", profileHint: "Наставник подстраивает под это тон и уровень.",
  name: "Имя", namePh: "Аня", grade: "Класс / уровень", gradePh: "7 класс",
  defaultLang: "Язык по умолчанию", language: "Язык",
  cancel: "Отмена", save: "Сохранить", saved: "Сохранено",
  freeLimit: "Ты достиг лимита в 3 бесплатных сообщения в день. Оформи подписку, чтобы продолжить.",
  upgrade: "Улучшить",
  freeRemaining: (n) => `Осталось ${n} бесплатных сообщений сегодня`,
  freeExhausted: "Дневной лимит исчерпан — оформи подписку для безлимита",
  math: "Математика", physics: "Физика", writing: "Письмо", code: "Код",
};

const tr: Dict = {
  newSession: "Yeni oturum", sessions: "Oturumlar", stuckTopics: "Takıldığın konular",
  noSessions: "Henüz oturum yok", profile: "Profil", setGrade: "Sınıfını belirle",
  signOut: "Çıkış yap", whatLearn: "Bugün ne öğrenmek istiyorsun?",
  pickSubject: "Bir ders seç, yeni bir oturum başlatayım. Her şey otomatik kaydedilir.",
  askAnything: "Bana istediğini sor.", tutorThinking: "Eğitmen düşünüyor…",
  askPlaceholder: "Bir soru sor ya da neyi denediğini göster…",
  studentProfile: "Öğrenci profili", profileHint: "Eğitmen; tonu ve seviyeyi buna göre ayarlar.",
  name: "Ad", namePh: "Ada", grade: "Sınıf / seviye", gradePh: "7. sınıf",
  defaultLang: "Varsayılan dil", language: "Dil",
  cancel: "İptal", save: "Kaydet", saved: "Kaydedildi",
  freeLimit: "Günlük 3 ücretsiz mesaj sınırına ulaştın. Devam etmek için yükselt.",
  upgrade: "Yükselt",
  freeRemaining: (n) => `Bugün ${n} ücretsiz mesajın kaldı`,
  freeExhausted: "Günlük sınıra ulaştın — sınırsız için yükselt",
  math: "Matematik", physics: "Fizik", writing: "Yazma", code: "Kod",
};

const zh: Dict = {
  newSession: "新会话", sessions: "会话记录", stuckTopics: "卡住的知识点",
  noSessions: "还没有会话", profile: "个人资料", setGrade: "设置年级",
  signOut: "退出登录", whatLearn: "今天想学什么？",
  pickSubject: "选一个科目，我来开启一个新会话。所有内容自动保存。",
  askAnything: "随便问我。", tutorThinking: "老师正在思考…",
  askPlaceholder: "问一个问题，或展示你尝试过的思路…",
  studentProfile: "学生资料", profileHint: "老师根据它调整语气和难度。",
  name: "姓名", namePh: "小明", grade: "年级 / 水平", gradePh: "七年级",
  defaultLang: "默认语言", language: "语言",
  cancel: "取消", save: "保存", saved: "已保存",
  freeLimit: "你已达到每天 3 条免费消息的上限。升级即可继续。",
  upgrade: "升级",
  freeRemaining: (n) => `今天还剩 ${n} 条免费消息`,
  freeExhausted: "已达免费每日上限 — 升级即可无限使用",
  math: "数学", physics: "物理", writing: "写作", code: "编程",
};

const ja: Dict = {
  newSession: "新しいセッション", sessions: "セッション", stuckTopics: "つまずいた話題",
  noSessions: "まだセッションはありません", profile: "プロフィール", setGrade: "学年を設定",
  signOut: "サインアウト", whatLearn: "今日は何を学びたい？",
  pickSubject: "科目を選んでね。新しいセッションを始めるよ。全部自動保存されるよ。",
  askAnything: "何でも聞いてね。", tutorThinking: "先生が考えています…",
  askPlaceholder: "質問するか、試したことを見せてね…",
  studentProfile: "生徒プロフィール", profileHint: "先生がトーンとレベルを合わせるのに使います。",
  name: "名前", namePh: "あかり", grade: "学年 / レベル", gradePh: "中1",
  defaultLang: "既定の言語", language: "言語",
  cancel: "キャンセル", save: "保存", saved: "保存しました",
  freeLimit: "1日3件の無料メッセージ上限に達しました。アップグレードで続けられます。",
  upgrade: "アップグレード",
  freeRemaining: (n) => `今日はあと ${n} 件の無料メッセージ`,
  freeExhausted: "1日の無料上限に達しました — アップグレードで無制限に",
  math: "数学", physics: "物理", writing: "作文", code: "プログラミング",
};

const ko: Dict = {
  newSession: "새 세션", sessions: "세션", stuckTopics: "막힌 주제",
  noSessions: "아직 세션이 없어요", profile: "프로필", setGrade: "학년 설정",
  signOut: "로그아웃", whatLearn: "오늘은 무엇을 배우고 싶어요?",
  pickSubject: "과목을 고르면 새 세션을 시작할게요. 모두 자동 저장됩니다.",
  askAnything: "무엇이든 물어봐요.", tutorThinking: "튜터가 생각 중…",
  askPlaceholder: "질문하거나 시도한 걸 보여줘요…",
  studentProfile: "학생 프로필", profileHint: "튜터가 톤과 난이도를 맞추는 데 사용해요.",
  name: "이름", namePh: "아다", grade: "학년 / 수준", gradePh: "중1",
  defaultLang: "기본 언어", language: "언어",
  cancel: "취소", save: "저장", saved: "저장됨",
  freeLimit: "하루 무료 3개 메시지 한도에 도달했어요. 계속하려면 업그레이드하세요.",
  upgrade: "업그레이드",
  freeRemaining: (n) => `오늘 무료 메시지 ${n}개 남음`,
  freeExhausted: "무료 일일 한도 도달 — 업그레이드하면 무제한",
  math: "수학", physics: "물리", writing: "글쓰기", code: "코딩",
};

const hi: Dict = {
  newSession: "नया सत्र", sessions: "सत्र", stuckTopics: "अटके हुए विषय",
  noSessions: "अभी कोई सत्र नहीं", profile: "प्रोफ़ाइल", setGrade: "कक्षा तय करें",
  signOut: "साइन आउट", whatLearn: "आज आप क्या सीखना चाहेंगे?",
  pickSubject: "एक विषय चुनें — मैं नया सत्र शुरू करता हूँ। सब कुछ अपने आप सेव होता है।",
  askAnything: "कुछ भी पूछें।", tutorThinking: "ट्यूटर सोच रहा है…",
  askPlaceholder: "कोई सवाल पूछें या दिखाएँ कि आपने क्या कोशिश की…",
  studentProfile: "छात्र प्रोफ़ाइल", profileHint: "ट्यूटर इसका उपयोग लहजे और स्तर के लिए करता है।",
  name: "नाम", namePh: "आदा", grade: "कक्षा / स्तर", gradePh: "कक्षा 7",
  defaultLang: "डिफ़ॉल्ट भाषा", language: "भाषा",
  cancel: "रद्द करें", save: "सेव करें", saved: "सेव हो गया",
  freeLimit: "आप रोज़ 3 फ्री संदेशों की सीमा तक पहुँच गए। जारी रखने के लिए अपग्रेड करें।",
  upgrade: "अपग्रेड",
  freeRemaining: (n) => `आज ${n} फ्री संदेश बाकी हैं`,
  freeExhausted: "दैनिक फ्री सीमा समाप्त — असीमित के लिए अपग्रेड करें",
  math: "गणित", physics: "भौतिकी", writing: "लेखन", code: "कोडिंग",
};

const DICTS: Record<LangCode, Dict> = {
  en, he, ar, es, fr, de, pt, it, nl, ru, tr, zh, ja, ko, hi,
};

export function t(code: string): Dict {
  return DICTS[normalizeLang(code)];
}

// -------- Subject labels (extensible) --------
// Note: subject id is stored in the DB as free text, so we can add new subjects
// without a migration. Labels below feed the sidebar/empty-state UI; the tutor
// AI always receives the raw id and responds in the user's selected language.

export type Subject =
  | "math" | "physics" | "writing" | "code"
  | "english" | "science" | "hebrew" | "chemistry" | "biology";

export const SUBJECT_IDS: Subject[] = [
  "math", "physics", "chemistry", "biology", "science", "english", "hebrew", "writing", "code",
];

const SUBJECT_LABELS: Partial<Record<LangCode, Partial<Record<Subject, string>>>> = {
  en: { math: "Math", physics: "Physics", writing: "Writing", code: "Code", english: "English", science: "Science", hebrew: "Hebrew", chemistry: "Chemistry", biology: "Biology" },
  he: { math: "מתמטיקה", physics: "פיזיקה", writing: "כתיבה", code: "קוד", english: "אנגלית", science: "מדעים", hebrew: "לשון", chemistry: "כימיה", biology: "ביולוגיה" },
  ar: { math: "رياضيات", physics: "فيزياء", writing: "كتابة", code: "برمجة", english: "الإنجليزية", science: "علوم", hebrew: "العبرية", chemistry: "كيمياء", biology: "أحياء" },
  es: { english: "Inglés", science: "Ciencias", hebrew: "Hebreo", chemistry: "Química", biology: "Biología" },
  fr: { english: "Anglais", science: "Sciences", hebrew: "Hébreu", chemistry: "Chimie", biology: "Biologie" },
  de: { english: "Englisch", science: "Naturwissenschaften", hebrew: "Hebräisch", chemistry: "Chemie", biology: "Biologie" },
  ru: { english: "Английский", science: "Естествознание", hebrew: "Иврит", chemistry: "Химия", biology: "Биология" },
  zh: { english: "英语", science: "科学", hebrew: "希伯来语", chemistry: "化学", biology: "生物" },
};

export function subjectLabel(code: string, id: Subject): string {
  const lc = normalizeLang(code);
  const dict = t(lc) as unknown as Record<string, string>;
  const extra = SUBJECT_LABELS[lc]?.[id];
  if (extra) return extra;
  if (typeof dict[id] === "string") return dict[id];
  return SUBJECT_LABELS.en?.[id] ?? id;
}