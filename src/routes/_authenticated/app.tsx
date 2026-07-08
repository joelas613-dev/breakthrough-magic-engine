import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  GraduationCap,
  Plus,
  Send,
  Loader2,
  Trash2,
  LogOut,
  Sigma,
  Atom,
  PenLine,
  Code2,
  Target,
  Sparkles,
  Menu,
  X,
  Globe,
  Languages as LanguagesIcon,
  FlaskConical,
  Dna,
  Microscope,
  BookOpen,
  Feather,
  Paperclip,
  Camera,
  Mic,
  Square,
  ImageIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listConversations,
  createConversation,
  deleteConversation,
  getConversation,
  sendMessage,
  getMyProfile,
  updateMyProfile,
  listStuckTopics,
  getUsageStatus,
  transcribeAudio,
} from "@/lib/prodigy.functions";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import { LANGUAGES, isRtl, normalizeLang, t, subjectLabel, type LangCode, type Subject } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/app")({
  component: TutorApp,
});

const SUBJECTS: { id: Subject; icon: typeof Sigma }[] = [
  { id: "math", icon: Sigma },
  { id: "physics", icon: Atom },
  { id: "chemistry", icon: FlaskConical },
  { id: "biology", icon: Dna },
  { id: "science", icon: Microscope },
  { id: "english", icon: LanguagesIcon },
  { id: "hebrew", icon: BookOpen },
  { id: "writing", icon: PenLine },
  { id: "code", icon: Code2 },
];

function TutorApp() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const fetchProfile = useServerFn(getMyProfile);
  const fetchConvs = useServerFn(listConversations);
  const fetchStuck = useServerFn(listStuckTopics);
  const fetchConv = useServerFn(getConversation);
  const createConvFn = useServerFn(createConversation);
  const deleteConvFn = useServerFn(deleteConversation);
  const sendMsgFn = useServerFn(sendMessage);
  const updateProfileFn = useServerFn(updateMyProfile);
  const fetchUsage = useServerFn(getUsageStatus);

  const profile = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const convs = useQuery({ queryKey: ["conversations"], queryFn: () => fetchConvs() });
  const stuck = useQuery({ queryKey: ["stuck"], queryFn: () => fetchStuck() });
  const usage = useQuery({ queryKey: ["usage"], queryFn: () => fetchUsage() });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!activeId && convs.data && convs.data.length > 0) {
      setActiveId(convs.data[0].id);
    }
  }, [convs.data, activeId]);

  // First-time users: force profile setup
  useEffect(() => {
    if (profile.data && (!profile.data.grade || !profile.data.display_name)) {
      setShowProfile(true);
    }
  }, [profile.data]);

  const activeConv = useQuery({
    queryKey: ["conversation", activeId],
    queryFn: () => fetchConv({ data: { id: activeId! } }),
    enabled: !!activeId,
  });

  const [pendingReply, setPendingReply] = useState(false);

  const locale = normalizeLang(profile.data?.locale);
  const isHe = isRtl(locale);
  const tr = t(locale);

  const newConv = useMutation({
    mutationFn: (subject: Subject) =>
      createConvFn({
        data: {
          subject,
          grade: profile.data?.grade || "middle school",
          locale,
        },
      }),
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      setActiveId(row.id);
      setSidebarOpen(false);
    },
  });

  const delConv = useMutation({
    mutationFn: (id: string) => deleteConvFn({ data: { id } }),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      if (activeId === id) setActiveId(null);
    },
  });

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  async function changeLanguage(next: LangCode) {
    await updateProfileFn({ data: { locale: next } });
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden" dir={isHe ? "rtl" : "ltr"}>
      <Toaster theme="dark" position="top-center" />

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 ${isHe ? "right-0" : "left-0"} z-40 w-72 bg-card border-${isHe ? "l" : "r"} border-border flex flex-col transition-transform ${
          sidebarOpen ? "translate-x-0" : isHe ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight">PRODIGY</span>
          </Link>
          <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language picker */}
        <div className="px-3 pt-3">
          <LanguagePicker current={locale} onChange={changeLanguage} label={tr.language} />
        </div>

        <div className="p-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 px-1">
            {tr.newSession}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => newConv.mutate(s.id)}
                  disabled={newConv.isPending}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition text-xs disabled:opacity-50"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{subjectLabel(locale, s.id)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 px-1 mt-2">
            {tr.sessions}
          </div>
          {convs.isLoading && <div className="text-xs text-muted-foreground px-2">…</div>}
          {convs.data?.length === 0 && (
            <div className="text-xs text-muted-foreground px-2">
              {tr.noSessions}
            </div>
          )}
          <div className="space-y-1">
            {convs.data?.map((c) => {
              const Icon = SUBJECTS.find((s) => s.id === c.subject)?.icon || Sigma;
              const isActive = c.id === activeId;
              return (
                <div
                  key={c.id}
                  className={`group flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer transition ${
                    isActive ? "bg-primary/10 border border-primary/40" : "hover:bg-accent"
                  }`}
                  onClick={() => {
                    setActiveId(c.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 text-primary" />
                  <span className="flex-1 text-sm truncate">{c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      delConv.mutate(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {stuck.data && stuck.data.length > 0 && (
            <>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 px-1 mt-6 flex items-center gap-1">
                <Target className="w-3 h-3" /> {tr.stuckTopics}
              </div>
              <div className="space-y-1">
                {stuck.data.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between px-2 py-1.5 rounded text-xs bg-destructive/5 border border-destructive/20"
                  >
                    <span className="truncate">{t.topic}</span>
                    <span className="font-mono text-destructive">×{t.hit_count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent transition"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {(profile.data?.display_name || "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 text-left rtl:text-right min-w-0">
              <div className="text-sm font-medium truncate">
                {profile.data?.display_name || tr.profile}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {profile.data?.grade || tr.setGrade}
              </div>
            </div>
          </button>
          <button
            onClick={handleSignOut}
            className="mt-2 w-full flex items-center gap-2 p-2 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition"
          >
            <LogOut className="w-4 h-4" />
            {tr.signOut}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <PaymentTestModeBanner />
        {usage.data && <UpgradeBanner usage={usage.data} locale={locale} />}
        <div className="md:hidden p-3 border-b border-border flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold">
            {activeConv.data?.conversation.title || "Prodigy"}
          </span>
        </div>

        {!activeId ? (
          <EmptyState locale={locale} onPick={(s) => newConv.mutate(s)} />
        ) : (
          <ChatArea
            key={activeId}
            conversationId={activeId}
            data={activeConv.data}
            isLoading={activeConv.isLoading}
            locale={locale}
            onSend={async (content, attachments) => {
              setPendingReply(true);
              try {
                await sendMsgFn({ data: { conversation_id: activeId, content, attachments: attachments ?? [] } });
                qc.invalidateQueries({ queryKey: ["conversation", activeId] });
                qc.invalidateQueries({ queryKey: ["conversations"] });
                qc.invalidateQueries({ queryKey: ["stuck"] });
                qc.invalidateQueries({ queryKey: ["usage"] });
              } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed";
                if (msg.startsWith("FREE_LIMIT_REACHED")) {
                  toast.error(tr.freeLimit);
                } else {
                  toast.error(msg);
                }
              } finally {
                setPendingReply(false);
              }
            }}
            pending={pendingReply}
          />
        )}
      </main>

      {showProfile && profile.data && (
        <ProfileModal
          initial={profile.data}
          locale={locale}
          onClose={() => setShowProfile(false)}
          onSave={async (patch) => {
            await updateProfileFn({ data: patch });
            qc.invalidateQueries({ queryKey: ["profile"] });
            toast.success(tr.saved);
            setShowProfile(false);
          }}
        />
      )}
    </div>
  );
}

function LanguagePicker({
  current,
  onChange,
  label,
}: {
  current: LangCode;
  onChange: (l: LangCode) => void;
  label: string;
}) {
  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition text-sm">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-base leading-none">{currentLang.flag}</span>
          <span className="flex-1 text-left rtl:text-right truncate">{currentLang.nativeLabel}</span>
          <span className="text-[10px] font-mono uppercase text-muted-foreground">{current}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
        <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => onChange(l.code)}
            className={`gap-2 cursor-pointer ${l.code === current ? "bg-primary/10 text-primary" : ""}`}
          >
            <span className="text-base leading-none">{l.flag}</span>
            <span dir={l.dir} className="flex-1">{l.nativeLabel}</span>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">{l.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState({ locale, onPick }: { locale: LangCode; onPick: (s: Subject) => void }) {
  const tr = t(locale);
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <Sparkles className="w-10 h-10 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">
          {tr.whatLearn}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {tr.pickSubject}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {SUBJECTS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => onPick(s.id)}
                className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition flex flex-col items-center gap-2"
              >
                <Icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">{subjectLabel(locale, s.id)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type ConvData = { conversation: { id: string; subject: string; title: string; locale: string; grade: string | null }; messages: { id: string; role: "user" | "assistant"; content: string; created_at: string }[] };

type Attachment = { data: string; mime: string; preview: string };

async function fileToAttachment(file: File): Promise<Attachment> {
  // Downscale large images to keep upload small
  const maxDim = 1600;
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  const jpeg = canvas.toDataURL("image/jpeg", 0.85);
  const base64 = jpeg.split(",")[1];
  return { data: base64, mime: "image/jpeg", preview: jpeg };
}

function ChatArea({
  data,
  isLoading,
  locale,
  onSend,
  pending,
}: {
  conversationId: string;
  data: ConvData | undefined;
  isLoading: boolean;
  locale: LangCode;
  onSend: (content: string, attachments?: { data: string; mime: string }[]) => Promise<void>;
  pending: boolean;
}) {
  const tr = t(locale);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const transcribeFn = useServerFn(transcribeAudio);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [data?.messages?.length, pending]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if ((!text && attachments.length === 0) || pending) return;
    setInput("");
    const toSend = attachments.map(({ data, mime }) => ({ data, mime }));
    setAttachments([]);
    await onSend(text, toSend);
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 4 - attachments.length);
    const next: Attachment[] = [];
    for (const f of arr) {
      if (!f.type.startsWith("image/")) continue;
      try {
        next.push(await fileToAttachment(f));
      } catch {
        toast.error("Failed to load image");
      }
    }
    setAttachments((prev) => [...prev, ...next].slice(0, 4));
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size < 1000) { toast.error("Recording too short"); return; }
        setTranscribing(true);
        try {
          const buf = await blob.arrayBuffer();
          let bin = ""; const bytes = new Uint8Array(buf);
          for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
          const b64 = btoa(bin);
          const { text } = await transcribeFn({ data: { audio: b64, mime: blob.type, language: locale } });
          if (text) setInput((prev) => (prev ? prev + " " : "") + text);
          else toast.error("No speech detected");
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Transcription failed");
        } finally {
          setTranscribing(false);
        }
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-6">
          {isLoading && <div className="text-sm text-muted-foreground">…</div>}
          {data?.messages.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">
              {tr.askAnything}
            </div>
          )}
          {data?.messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:my-2">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                {tr.tutorThinking}
              </div>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={submit} className="border-t border-border p-3 md:p-4 bg-card/50">
        <div className="max-w-3xl mx-auto space-y-2">
          {attachments.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {attachments.map((a, i) => (
                <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                  <img src={a.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                    aria-label="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
            <button type="button" onClick={() => galleryInputRef.current?.click()}
              disabled={pending || attachments.length >= 4}
              className="h-12 w-11 shrink-0 rounded-md border border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 disabled:opacity-40"
              aria-label="Attach image">
              <ImageIcon className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => cameraInputRef.current?.click()}
              disabled={pending || attachments.length >= 4}
              className="h-12 w-11 shrink-0 rounded-md border border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 disabled:opacity-40"
              aria-label="Take photo">
              <Camera className="w-4 h-4" />
            </button>
            <button type="button" onClick={recording ? stopRecording : startRecording}
              disabled={pending || transcribing}
              className={`h-12 w-11 shrink-0 rounded-md border flex items-center justify-center disabled:opacity-40 ${
                recording ? "border-destructive bg-destructive/10 text-destructive animate-pulse" : "border-border hover:border-primary hover:bg-primary/5"
              }`}
              aria-label={recording ? "Stop recording" : "Record voice"}>
              {transcribing ? <Loader2 className="w-4 h-4 animate-spin" /> : recording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
              placeholder={recording ? "🎙 Recording…" : transcribing ? "…" : tr.askPlaceholder}
            className="flex-1 h-12 px-4 rounded-md bg-background border border-border focus:outline-none focus:border-primary text-sm"
            disabled={pending}
          />
          <button
            type="submit"
              disabled={pending || (!input.trim() && attachments.length === 0)}
            className="h-12 w-12 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
          </div>
        </div>
      </form>
    </>
  );
}

function ProfileModal({
  initial,
  locale,
  onSave,
  onClose,
}: {
  initial: { display_name: string | null; grade: string | null; preferred_subject: string | null; locale: string };
  locale: LangCode;
  onSave: (p: { display_name?: string; grade?: string; preferred_subject?: Subject; locale?: LangCode }) => Promise<void>;
  onClose: () => void;
}) {
  const tr = t(locale);
  const isHe = isRtl(locale);
  const [name, setName] = useState(initial.display_name || "");
  const [grade, setGrade] = useState(initial.grade || "");
  const [pickedLocale, setPickedLocale] = useState<LangCode>(normalizeLang(initial.locale));
  const [saving, setSaving] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" dir={isHe ? "rtl" : "ltr"}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold">{tr.studentProfile}</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {tr.profileHint}
        </p>
        <div className="space-y-3 mt-4">
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {tr.name}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary"
              placeholder={tr.namePh}
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {tr.grade}
            </span>
            <input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary"
              placeholder={tr.gradePh}
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {tr.defaultLang}
            </span>
            <div className="mt-1 grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setPickedLocale(l.code)}
                  className={`h-10 rounded-md border text-xs flex items-center justify-center gap-1 px-2 ${
                    pickedLocale === l.code ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span className="truncate" dir={l.dir}>{l.nativeLabel}</span>
                </button>
              ))}
            </div>
          </label>
        </div>
        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-md border border-border text-sm hover:bg-accent"
          >
            {tr.cancel}
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave({
                  display_name: name.trim() || undefined,
                  grade: grade.trim() || undefined,
                  locale: pickedLocale,
                });
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving || !name.trim() || !grade.trim()}
            className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {tr.save}
          </button>
        </div>
      </div>
    </div>
  );
}