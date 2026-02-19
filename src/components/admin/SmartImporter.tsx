import { useState, useRef, useCallback } from 'react';
import {
  Sparkles, Upload, FileText, Loader2, Check, X, AlertTriangle,
  Globe, ChevronDown, ChevronUp, Trash2, Edit2, Save, RefreshCw,
  CheckSquare, Square, Wand2 } from
'lucide-react';
import { parseLinksFromText, importParsedLinks } from '@/lib/adminApi';
import type { ParsedLink } from '@/lib/adminApi';
import { ICON_MAP } from '@/lib/iconMap';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/helpers';

type SectionRow = Tables<'sections'>;

interface SmartImporterProps {
  sections: SectionRow[];
  onImportComplete: () => void;
}

type Step = 'input' | 'parsing' | 'preview' | 'importing' | 'done';

export const SmartImporter = ({ sections, onImportComplete }: SmartImporterProps) => {
  const [step, setStep] = useState<Step>('input');
  const [text, setText] = useState('');
  const [parsedLinks, setParsedLinks] = useState<ParsedLink[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [sectionMapping, setSectionMapping] = useState<Record<string, string>>({});
  const [importSummary, setImportSummary] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== File handling =====
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileText = await file.text();
      setText((prev) => prev ? prev + '\n\n' + fileText : fileText);
      toast.success(`קובץ "${file.name}" נטען`);
    } catch {
      toast.error('שגיאה בקריאת הקובץ');
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // ===== Parse with AI =====
  const handleParse = async () => {
    if (!text.trim()) return;
    setStep('parsing');
    setError(null);

    try {
      const result = await parseLinksFromText(text);
      if (result.links.length === 0) {
        setError('לא נמצאו קישורים בטקסט. נסה להדביק טקסט שמכיל כתובות URL.');
        setStep('input');
        return;
      }
      setParsedLinks(result.links);
      setSummary(result.summary);
      // Select all by default
      setSelectedIndices(new Set(result.links.map((_, i) => i)));
      // Build initial section mapping
      const mapping: Record<string, string> = {};
      for (const link of result.links) {
        const sec = link.suggested_section;
        if (!mapping[sec]) {
          const existing = sections.find(
            (s) => s.title === sec || s.title.includes(sec) || sec.includes(s.title)
          );
          if (existing) mapping[sec] = existing.id;
          // else leave empty — will be created
        }
      }
      setSectionMapping(mapping);
      setStep('preview');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'שגיאה בניתוח');
      setStep('input');
    }
  };

  // ===== Import confirmed links =====
  const handleImport = async () => {
    const linksToImport = parsedLinks.filter((_, i) => selectedIndices.has(i));
    if (linksToImport.length === 0) {
      toast.error('לא נבחרו קישורים לייבוא');
      return;
    }

    setStep('importing');
    setError(null);

    try {
      const result = await importParsedLinks(linksToImport, sectionMapping);
      setImportSummary(result.summary);
      setStep('done');
      toast.success(result.summary);
      onImportComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'שגיאה בייבוא');
      setStep('preview');
    }
  };

  // ===== Reset =====
  const handleReset = () => {
    setStep('input');
    setText('');
    setParsedLinks([]);
    setSelectedIndices(new Set());
    setSummary('');
    setError(null);
    setEditingIdx(null);
    setSectionMapping({});
    setImportSummary('');
  };

  // ===== Selection helpers =====
  const toggleSelect = (idx: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);else next.add(idx);
      return next;
    });
  };
  const selectAll = () => setSelectedIndices(new Set(parsedLinks.map((_, i) => i)));
  const selectNone = () => setSelectedIndices(new Set());

  // ===== Edit link inline =====
  const updateLink = (idx: number, field: keyof ParsedLink, value: string) => {
    setParsedLinks((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeLink = (idx: number) => {
    setParsedLinks((prev) => prev.filter((_, i) => i !== idx));
    setSelectedIndices((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < idx) next.add(i);else
        if (i > idx) next.add(i - 1);
      });
      return next;
    });
    setEditingIdx(null);
  };

  // Group by section
  const groupedLinks = parsedLinks.reduce<Record<string, {link: ParsedLink;idx: number;}[]>>((acc, link, idx) => {
    const sec = link.suggested_section || 'ללא קטגוריה';
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push({ link, idx });
    return acc;
  }, {});

  return (
    <div data-ev-id="ev_451378a3a3" className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button data-ev-id="ev_4f4186b2b9"
      onClick={() => setCollapsed(!collapsed)}
      className="w-full flex items-center gap-3 px-5 py-4 text-right hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

        <div data-ev-id="ev_8c1b67e98d" className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Wand2 className="w-4 h-4 text-purple-400" aria-hidden="true" />
        </div>
        <div data-ev-id="ev_c0cf7616ff" className="flex-1 text-right">
          <span data-ev-id="ev_5e9a0ef0c2" className="text-white/80 text-sm font-medium">ייבוא חכם בעזרת AI</span>
          <span data-ev-id="ev_f36d3a0b5d" className="text-white/30 text-xs mr-2">• הדבק טקסט, CSV, או קובץ — ה-AI יחלץ את הקישורים</span>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronUp className="w-4 h-4 text-white/30" />}
      </button>

      {!collapsed &&
      <div data-ev-id="ev_3ad8243ae8" className="px-5 pb-5 space-y-4 border-t border-white/[0.06] pt-4">
          {/* Error */}
          {error &&
        <div data-ev-id="ev_36d6642423" role="alert" className="flex items-start gap-2 text-red-400/80 text-sm px-3 py-2.5 bg-red-500/[0.06] border border-red-500/15 rounded-lg">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span data-ev-id="ev_c327d6e54c">{error}</span>
            </div>
        }

          {/* ===== STEP: INPUT ===== */}
          {step === 'input' &&
        <div data-ev-id="ev_297794b6a8" className="space-y-3">
              <div data-ev-id="ev_3d2e29e446">
                <label data-ev-id="ev_044aed94de" htmlFor="import-text" className="text-white/50 text-xs font-medium mb-1.5 block">
                  הדבק טקסט עם קישורים
                </label>
                <textarea data-ev-id="ev_898580097a"
            id="import-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={`דוגמאות:
• ChatGPT - https://chat.openai.com - צ'אטבוט AI מתקדם
• Midjourney https://midjourney.com יצירת תמונות
• או פשוט תוכן CSV/טבלה מ-Google Sheets`}
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 transition-all resize-y min-h-[120px]" />

              </div>

              <div data-ev-id="ev_62133a841b" className="flex items-center gap-2">
                {/* File upload */}
                <input data-ev-id="ev_985e905a4b"
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt,.md,.html"
            onChange={handleFileUpload}
            className="hidden"
            id="import-file" />

                <button data-ev-id="ev_191a52b4c9"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                  <Upload className="w-3.5 h-3.5" />
                  העלה קובץ
                </button>
                <span data-ev-id="ev_6d87caf75c" className="text-white/20 text-[10px]">CSV, TXT, HTML, MD</span>

                <div data-ev-id="ev_cc1b7cb4f4" className="flex-1" />

                {/* Parse button */}
                <button data-ev-id="ev_900842abb9"
            onClick={handleParse}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium hover:from-purple-500 hover:to-cyan-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shadow-lg shadow-purple-500/10">

                  <Sparkles className="w-4 h-4" />
                  נתח עם AI
                </button>
              </div>
            </div>
        }

          {/* ===== STEP: PARSING ===== */}
          {step === 'parsing' &&
        <div data-ev-id="ev_2668121a5a" className="flex flex-col items-center justify-center py-10 gap-3">
              <div data-ev-id="ev_d6a8e7cc0d" className="relative">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p data-ev-id="ev_7335bb697f" className="text-white/50 text-sm">ה-AI מנתח את הטקסט...</p>
              <p data-ev-id="ev_3f016d06d9" className="text-white/20 text-xs">זה יכול לקחת כמה שניות</p>
            </div>
        }

          {/* ===== STEP: PREVIEW ===== */}
          {step === 'preview' &&
        <div data-ev-id="ev_92f868c698" className="space-y-3">
              {/* Summary */}
              <div data-ev-id="ev_496819bbae" className="flex items-center gap-2 px-3 py-2 bg-purple-500/[0.06] border border-purple-500/15 rounded-lg">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span data-ev-id="ev_23379b6ab7" className="text-purple-300/80 text-sm">{summary}</span>
              </div>

              {/* Selection controls */}
              <div data-ev-id="ev_181bc90f99" className="flex items-center gap-2">
                <button data-ev-id="ev_772ab854cb" onClick={selectAll} className="text-xs text-white/40 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1">
                  בחר הכל
                </button>
                <button data-ev-id="ev_a24ee180ed" onClick={selectNone} className="text-xs text-white/40 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1">
                  נקה הכל
                </button>
                <span data-ev-id="ev_9566d9f419" className="text-white/25 text-xs">{selectedIndices.size} / {parsedLinks.length} נבחרו</span>
              </div>

              {/* Grouped links */}
              <div data-ev-id="ev_e0301ec5af" className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                {Object.entries(groupedLinks).map(([sectionName, items]) =>
            <div data-ev-id="ev_05155ef0c1" key={sectionName} className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
                    {/* Section header */}
                    <div data-ev-id="ev_bb2a65e430" className="flex items-center gap-2 px-3 py-2 bg-white/[0.02]">
                      <span data-ev-id="ev_1c9225874a" className="text-white/60 text-xs font-medium">{sectionName}</span>
                      <span data-ev-id="ev_6d613b6d29" className="text-white/25 text-[10px]">({items.length})</span>
                      <div data-ev-id="ev_fefba20185" className="flex-1" />
                      {/* Section mapping dropdown */}
                      <select data-ev-id="ev_b76fbfb6a9"
                value={sectionMapping[sectionName] || ''}
                onChange={(e) => setSectionMapping((prev) => ({ ...prev, [sectionName]: e.target.value }))}
                className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-white/60 text-[10px] focus:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none cursor-pointer max-w-[140px]"
                aria-label={`סקציה ל: ${sectionName}`}>

                        <option data-ev-id="ev_3905dd11e5" value="">✨ צור חדשה</option>
                        {sections.filter((s) => s.is_visible).map((s) =>
                  <option data-ev-id="ev_b0e3160e7d" key={s.id} value={s.id}>{s.emoji} {s.title}</option>
                  )}
                      </select>
                    </div>

                    {/* Links in section */}
                    <div data-ev-id="ev_580fb93c12" className="divide-y divide-white/[0.04]">
                      {items.map(({ link, idx }) => {
                  const isSelected = selectedIndices.has(idx);
                  const isEditing = editingIdx === idx;
                  const IconComponent = ICON_MAP[link.icon_name] || ICON_MAP['Globe'] || Globe;

                  if (isEditing) {
                    return (
                      <div data-ev-id="ev_9b9c7cb7e1" key={idx} className="px-3 py-2.5 space-y-2 bg-white/[0.02]">
                              <div data-ev-id="ev_fca3d99f7a" className="flex gap-2">
                                <input data-ev-id="ev_62ef8e616f" value={link.title} onChange={(e) => updateLink(idx, 'title', e.target.value)}
                          placeholder="שם" className="flex-1 px-2 py-1.5 bg-white/[0.06] border border-white/[0.1] rounded text-white/80 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50" />
                                <input data-ev-id="ev_df92b7e477" value={link.url} onChange={(e) => updateLink(idx, 'url', e.target.value)}
                          placeholder="URL" dir="ltr" className="flex-1 px-2 py-1.5 bg-white/[0.06] border border-white/[0.1] rounded text-white/80 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50" />
                              </div>
                              <div data-ev-id="ev_2195409003" className="flex gap-2">
                                <input data-ev-id="ev_bcd7eac1d5" value={link.subtitle} onChange={(e) => updateLink(idx, 'subtitle', e.target.value)}
                          placeholder="תיאור" className="flex-1 px-2 py-1.5 bg-white/[0.06] border border-white/[0.1] rounded text-white/80 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50" />
                                <input data-ev-id="ev_4edf6d7ecf" value={link.color} onChange={(e) => updateLink(idx, 'color', e.target.value)}
                          type="color" className="w-8 h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer" />
                              </div>
                              <div data-ev-id="ev_af097e2273" className="flex items-center gap-2">
                                <button data-ev-id="ev_6e4091fc2c" onClick={() => setEditingIdx(null)} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                                  <Save className="w-3 h-3" /> שמור
                                </button>
                                <button data-ev-id="ev_22efd4dbc4" onClick={() => removeLink(idx)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-red-400/60 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400">
                                  <Trash2 className="w-3 h-3" /> מחק
                                </button>
                              </div>
                            </div>);

                  }

                  return (
                    <div data-ev-id="ev_28176a0f84" key={idx} className={`flex items-center gap-2 px-3 py-2 transition-colors ${isSelected ? '' : 'opacity-40'}`}>
                            <button data-ev-id="ev_84c9e42c1d" onClick={() => toggleSelect(idx)} className="p-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                              {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-white/25" />}
                            </button>
                            <div data-ev-id="ev_71368d25b5" className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${link.color}20` }}>
                              <IconComponent className="w-3 h-3" style={{ color: link.color }} />
                            </div>
                            <div data-ev-id="ev_10b79671a6" className="flex-1 min-w-0">
                              <div data-ev-id="ev_1abaad9750" className="text-white/80 text-xs font-medium truncate">{link.title}</div>
                              <div data-ev-id="ev_9c56d43f64" className="text-white/30 text-[10px] truncate" dir="ltr">{link.url}</div>
                            </div>
                            <button data-ev-id="ev_6f09df968b" onClick={() => setEditingIdx(idx)} aria-label="ערוך"
                      className="p-1 text-white/15 hover:text-white/40 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>);

                })}
                    </div>
                  </div>
            )}
              </div>

              {/* Action buttons */}
              <div data-ev-id="ev_6b0ed26188" className="flex items-center gap-2 pt-2">
                <button data-ev-id="ev_ff69af4f04" onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <RefreshCw className="w-3.5 h-3.5" /> התחל מחדש
                </button>
                <div data-ev-id="ev_1b4297c992" className="flex-1" />
                <button data-ev-id="ev_0dd5a7d1b3"
            onClick={handleImport}
            disabled={selectedIndices.size === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 shadow-lg shadow-green-500/10">

                  <Check className="w-4 h-4" />
                  ייבא {selectedIndices.size} קישורים
                </button>
              </div>
            </div>
        }

          {/* ===== STEP: IMPORTING ===== */}
          {step === 'importing' &&
        <div data-ev-id="ev_6607bc8b65" className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
              <p data-ev-id="ev_6fa9126afd" className="text-white/50 text-sm">מייבא {selectedIndices.size} קישורים...</p>
            </div>
        }

          {/* ===== STEP: DONE ===== */}
          {step === 'done' &&
        <div data-ev-id="ev_69e3f8ebcd" className="flex flex-col items-center justify-center py-8 gap-3">
              <div data-ev-id="ev_404f77cdf7" className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <p data-ev-id="ev_90283bb000" className="text-green-400/80 text-sm font-medium">{importSummary}</p>
              <button data-ev-id="ev_7a6e619f7b"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary mt-2">

                <RefreshCw className="w-3.5 h-3.5" /> ייבוא נוסף
              </button>
            </div>
        }
        </div>
      }
    </div>);

};

export default SmartImporter;