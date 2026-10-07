"use client";

import { useEffect, useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
  rss: string;
};

type Story = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
};

type Investigation = {
  background: string;
  verification: { source: string; detail: string }[];
  timeline: { time: string; event: string }[];
  script: string;
  keyEntities: string[];
};

const categories: Category[] = [
  { id: "POLITICS", name: "السياسة والدولية", rss: "" },
  { id: "ECONOMY", name: "الاقتصاد والأعمال", rss: "" },
  { id: "TECH", name: "التكنولوجيا والذكاء الاصطناعي", rss: "" },
  { id: "SCIENCE", name: "العلوم والبيئة", rss: "" },
  { id: "HEALTH", name: "الصحة والطب", rss: "" }
];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Investigation | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualContext, setManualContext] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [activeTab, setActiveTab] = useState("background");

  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key");
    if (saved) setApiKey(saved);
    loadNews(selectedCategory);
  }, [selectedCategory]);

  const showToast = (msg: string, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveApiKey = () => {
    localStorage.setItem("gemini_api_key", apiKey.trim());
    setSettingsOpen(false);
    showToast("تم حفظ المفتاح بنجاح!", "success");
  };

  async function loadNews(categoryId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${categoryId}`);
      const data = await res.json();
      const items = data.items || [];
      setStories(items);
      setSelectedStory(items[0] || null);
      setAnalysis(null);
    } catch {
      setStories([]);
      setSelectedStory(null);
    } finally {
      setLoading(false);
    }
  }

  const filteredStories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stories;
    return stories.filter(
      (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [stories, query]);

  async function analyzeCurrentStory() {
    if (!selectedStory) return;
    setAnalysisLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedStory.title,
          source: selectedStory.source,
          description: selectedStory.description
        })
      });

      const json = await response.json();
      setAnalysis(json.fallback || json);
      showToast("تم اكتمال التحقيق بنجاح!", "success");
    } catch {
      setAnalysis({
        background: "تعذر التفاعل مع المحلل في هذه اللحظة.",
        verification: [],
        timeline: [],
        script: "سيناريو بديل",
        keyEntities: [selectedStory.source || "مصدر الخبر"]
      });
      showToast("تم توليد تحليل بديل", "warning");
    } finally {
      setAnalysisLoading(false);
    }
  }

  function addManualStory() {
    if (!manualTitle.trim()) return;

    const story: Story = {
      id: `manual-${Date.now()}`,
      title: manualTitle.trim(),
      description: manualContext.trim() || manualTitle.trim(),
      link: "#",
      pubDate: new Date().toLocaleDateString("ar-SA"),
      source: "إدخال يدوي"
    };

    setStories((prev) => [story, ...prev]);
    setSelectedStory(story);
    setManualTitle("");
    setManualContext("");
    setManualOpen(false);
    setAnalysis(null);
    showToast("تمت إضافة الموضوع بنجاح", "success");
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("تم نسخ النص!", "success");
  };

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 left-5 z-50 px-5 py-3 rounded-lg text-white text-sm font-bold flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-emerald-600"
              : toast.type === "error"
              ? "bg-rose-600"
              : "bg-slate-900"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">إعدادات المفتاح المخصص</h3>
            <p className="text-sm text-slate-600">
              أدخل مفتاح Gemini API الخاص بك. احصل على مفتاح مجاني من:{" "}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-blue-600 font-bold">
                aistudio.google.com/apikey
              </a>
            </p>
            <input
              type="password"
              placeholder="أدخل مفتاح Gemini API..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSettingsOpen(false)}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
              >
                إغلاق
              </button>
              <button
                onClick={saveApiKey}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                حفظ المفتاح
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual News Modal */}
      {manualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">إضافة خبر يدوي</h3>
              <button onClick={() => setManualOpen(false)} className="text-slate-500 text-xl">
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">عنوان الموضوع:</label>
                <input
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="أدخل عنوان الموضوع..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">سياق إضافي (اختياري):</label>
                <textarea
                  value={manualContext}
                  onChange={(e) => setManualContext(e.target.value)}
                  rows={4}
                  placeholder="أضف أي تفاصيل إضافية..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setManualOpen(false)}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
              >
                إلغاء
              </button>
              <button
                onClick={addManualStory}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-slate-200 bg-slate-950 text-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-2 rounded-lg font-black text-xl w-10 h-10 flex items-center justify-center">
                TR
              </div>
              <div>
                <div className="text-2xl font-black">TrendRadar Studio</div>
                <div className="text-xs text-slate-400">منصة التحقيقات الإخبارية الاستقصائية</div>
              </div>
            </div>

            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 text-sm font-bold transition"
            >
              ⚙️ إعدادات
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                  selectedCategory === cat.id ? "bg-red-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-12">
        <aside className="rounded-2xl bg-white p-3 shadow-sm lg:col-span-4 h-[700px] flex flex-col">
          <div className="mb-3 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث في الأخبار..."
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500"
            />
            <button
              onClick={() => setManualOpen(true)}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              +
            </button>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">جاري تحميل الأخبار...</div>
            ) : filteredStories.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">لا توجد بيانات</div>
            ) : (
              filteredStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    setAnalysis(null);
                  }}
                  className={`w-full rounded-lg border p-3 text-right text-xs transition ${
                    selectedStory?.id === story.id ? "border-red-500 bg-red-50" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold text-slate-900 line-clamp-2">{story.title}</div>
                  <div className="mt-2 flex justify-between gap-2 text-[10px] text-slate-500">
                    <span className="truncate">{story.source}</span>
                    <span className="whitespace-nowrap">{story.pubDate}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="lg:col-span-8 flex flex-col gap-6">
          {selectedStory && (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                  الموضوع المستهدف
                </span>
                {selectedStory.link !== "#" && (
                  <a
                    href={selectedStory.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    المصدر ↗
                  </a>
                )}
              </div>

              <h2 className="text-lg font-black text-slate-900 mb-2">{selectedStory.title}</h2>

              <p className="text-xs text-slate-600 mb-4 line-clamp-2">{selectedStory.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <div className="text-xs text-slate-500">
                  {selectedStory.source} • {selectedStory.pubDate}
                </div>

                <button
                  onClick={analyzeCurrentStory}
                  disabled={analysisLoading}
                  className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white hover:from-red-700 hover:to-red-800 disabled:opacity-50"
                >
                  {analysisLoading ? "جارٍ..." : "توليد التحقيق"}
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white shadow-sm flex-1 flex flex-col overflow-hidden">
            {analysis ? (
              <>
                <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
                  {[
                    { id: "background", label: "التقرير" },
                    { id: "verification", label: "التحقق" },
                    { id: "timeline", label: "التسلسل" },
                    { id: "script", label: "السكربت" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-max py-3 px-3 font-bold text-xs border-b-2 transition ${
                        activeTab === tab.id
                          ? "border-red-600 text-red-600 bg-white"
                          : "border-transparent text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                  {analysis.keyEntities?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {analysis.keyEntities.map((entity, i) => (
                        <span
                          key={`${entity}-${i}`}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  )}

                  {activeTab === "background" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-black text-slate-900 text-sm">التقرير الاستقصائي</h3>
                        <button
                          onClick={() => copyToClipboard(analysis.background)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold"
                        >
                          نسخ
                        </button>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-700 whitespace-pre-wrap">
                        {analysis.background}
                      </div>
                    </div>
                  )}

                  {activeTab === "verification" && (
                    <div className="space-y-3">
                      {analysis.verification.map((item, i) => (
                        <div key={`${item.source}-${i}`} className="rounded-lg border border-slate-200 p-3">
                          <div className="mb-1 font-bold text-slate-900 text-xs">{item.source}</div>
                          <div className="text-xs text-slate-600">{item.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "timeline" && (
                    <div className="space-y-3 border-r-2 border-red-500 pr-3">
                      {analysis.timeline.map((item, i) => (
                        <div key={`${item.time}-${i}`} className="relative">
                          <div className="absolute -right-[11px] top-2 h-2 w-2 rounded-full bg-red-600"></div>
                          <div className="text-xs font-black text-red-700 mb-1">{item.time}</div>
                          <div className="text-xs text-slate-700">{item.event}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "script" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-black text-slate-900 text-sm">سيناريو الفيديو</h3>
                        <button
                          onClick={() => copyToClipboard(analysis.script)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-bold"
                        >
                          نسخ
                        </button>
                      </div>
                      <div className="rounded-lg bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-100 whitespace-pre-wrap">
                        {analysis.script}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-center text-slate-500">
                <div>
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-sm">حدد خبرًا ثم اضغط على "توليد التحقيق"</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
