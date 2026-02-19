import { useState, useId } from 'react';
import { X, Save, Trash2, ExternalLink, Eye, AlertCircle, Tag, Gift } from 'lucide-react';
import { ICON_NAMES, ICON_MAP, ANIMATION_OPTIONS, COLOR_PRESETS } from '@/lib/iconMap';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { Tables } from '@/integrations/supabase/helpers';
import type { IconAnimation } from '@/data/links';

type LinkRow = Tables<'links'>;

interface LinkEditorProps {
  link?: LinkRow | null;
  sectionId: string;
  onSave: (data: Partial<LinkRow>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

/** Available tag options — includes spare tags for future use */
const TAG_OPTIONS: {value: string;label: string;color: string;description: string;}[] = [
{ value: '', label: 'בלי תגית', color: '#6b7280', description: 'ללא תגית מיוחדת' },
{ value: 'free', label: 'חינם', color: '#22c55e', description: 'חינם לגמרי' },
{ value: 'freemium', label: 'חינם חלקית', color: '#3b82f6', description: 'שימוש מוגבל בחינם' },
{ value: 'deal', label: 'מבצע שווה', color: '#f59e0b', description: 'מבצע מיוחד או הנחה' },
{ value: 'new', label: 'חדש!', color: '#ec4899', description: 'נוסף לאחרונה' },
{ value: 'popular', label: 'פופולרי', color: '#ef4444', description: 'הכי פופולרי בקהילה' },
{ value: 'recommended', label: 'מומלץ', color: '#8b5cf6', description: 'מומלץ בחום' },
{ value: 'coming-soon', label: 'בקרוב', color: '#94a3b8', description: 'עדיין לא זמין' },
{ value: 'beta', label: 'בטא', color: '#06b6d4', description: 'בשלבי פיתוח מוקדמים' },
{ value: 'premium', label: 'פרמיום', color: '#d4a574', description: 'שירות בתשלום' },
{ value: 'open-source', label: 'קוד פתוח', color: '#10b981', description: 'קוד פתוח וחינם' },
{ value: 'israeli', label: 'ישראלי \uD83C\uDDEE\uD83C\uDDF1', color: '#3b82f6', description: 'מוצר ישראלי' }];


function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export const LinkEditor = ({ link, sectionId, onSave, onDelete, onCancel }: LinkEditorProps) => {
  const formId = useId();
  const [title, setTitle] = useState(link?.title ?? '');
  const [subtitle, setSubtitle] = useState(link?.subtitle ?? '');
  const [description, setDescription] = useState(link?.description ?? '');
  const [url, setUrl] = useState(link?.url ?? '');
  const [iconName, setIconName] = useState(link?.icon_name ?? 'Link');
  const [color, setColor] = useState(link?.color ?? '#06b6d4');
  const [animation, setAnimation] = useState(link?.animation ?? 'bounce');
  const [isVisible, setIsVisible] = useState(link?.is_visible ?? true);
  const [tag, setTag] = useState(link?.tag ?? '');
  const [affiliateBenefit, setAffiliateBenefit] = useState(link?.affiliate_benefit ?? '');
  const [showIcons, setShowIcons] = useState(false);
  const [urlTouched, setUrlTouched] = useState(false);

  const urlValid = !url.trim() || isValidUrl(url.trim());
  const canSave = title.trim() && url.trim() && isValidUrl(url.trim());

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      url: url.trim(),
      icon_name: iconName,
      color,
      animation,
      is_visible: isVisible,
      section_id: sectionId,
      tag: tag || null,
      affiliate_benefit: affiliateBenefit.trim() || null
    });
  };

  const IconComponent = ICON_MAP[iconName] || ICON_MAP['Link'];
  const selectedTag = TAG_OPTIONS.find((t) => t.value === tag);

  return (
    <div data-ev-id="ev_7ce5b92adc" className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4" dir="rtl" role="region" aria-label={link ? `עריכת קישור: ${link.title}` : 'הוספת קישור חדש'}>
      {/* Header */}
      <div data-ev-id="ev_7d4f02d56c" className="flex items-center justify-between">
        <h3 data-ev-id="ev_f2f4ebc3e6" className="text-white/80 font-semibold text-sm">
          {link ? 'עריכת קישור' : 'קישור חדש'}
        </h3>
        <button data-ev-id="ev_a85c93eb87" onClick={onCancel} aria-label="ביטול" className="text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Title + URL */}
      <div data-ev-id="ev_f594faa622" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div data-ev-id="ev_f33e8ae1bc">
          <label data-ev-id="ev_c51618d650" htmlFor={`${formId}-title`} className="text-white/50 text-xs mb-1 block">כותרת *</label>
          <input data-ev-id="ev_5059e4dd06" id={`${formId}-title`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="שם הקישור" required className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
        </div>
        <div data-ev-id="ev_2fbf8feef4">
          <label data-ev-id="ev_e33d8fa499" htmlFor={`${formId}-url`} className="text-white/50 text-xs mb-1 block">כתובת URL *</label>
          <input data-ev-id="ev_4a4878d3cb"
          id={`${formId}-url`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setUrlTouched(true)}
          placeholder="https://..."
          dir="ltr"
          required
          aria-invalid={urlTouched && !urlValid}
          className={`w-full px-3 py-2 bg-white/[0.06] border rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 ${urlTouched && !urlValid ? 'border-red-400/40' : 'border-white/[0.1]'}`} />

          {urlTouched && !urlValid && url.trim() &&
          <p data-ev-id="ev_7ee1d40f17" className="flex items-center gap-1 mt-1 text-red-400/70 text-[11px]">
              <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              כתובת URL לא תקינה — חייבת להתחיל ב-https://
            </p>
          }
        </div>
      </div>

      {/* Subtitle */}
      <div data-ev-id="ev_b5e49fdc57">
        <label data-ev-id="ev_588fce36f8" htmlFor={`${formId}-subtitle`} className="text-white/50 text-xs mb-1 block">כותרת משנה</label>
        <input data-ev-id="ev_7c86b100c1" id={`${formId}-subtitle`} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="תיאור קצר" className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
      </div>

      {/* Description */}
      <div data-ev-id="ev_b25306503f">
        <label data-ev-id="ev_b4d16d7acf" htmlFor={`${formId}-desc`} className="text-white/50 text-xs mb-1 block">תיאור מפורט</label>
        <textarea data-ev-id="ev_7a1aada6f5" id={`${formId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="תיאור שיופיע בריחוף" className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50" />
      </div>

      {/* Tag + Affiliate Benefit */}
      <div data-ev-id="ev_9a79ab0d0d" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tag */}
        <div data-ev-id="ev_d72d43c5ae">
          <label data-ev-id="ev_6647a15c81" htmlFor={`${formId}-tag`} className="text-white/50 text-xs mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3" aria-hidden="true" />
            תגית
          </label>
          <select data-ev-id="ev_ee7e5c6822"
          id={`${formId}-tag`}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 [&>option]:bg-gray-900">

            {TAG_OPTIONS.map((opt) =>
            <option data-ev-id="ev_036dc2848b" key={opt.value} value={opt.value}>
                {opt.label}{opt.description ? ` — ${opt.description}` : ''}
              </option>
            )}
          </select>
          {selectedTag && selectedTag.value &&
          <div data-ev-id="ev_525832e9ff" className="mt-1.5 flex items-center gap-1.5">
              <span data-ev-id="ev_edcc625c63"
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
            style={{
              color: selectedTag.color,
              borderColor: `${selectedTag.color}30`,
              backgroundColor: `${selectedTag.color}10`
            }}>

                {selectedTag.label}
              </span>
              <span data-ev-id="ev_a09e994884" className="text-white/30 text-[10px]">תצוגה מקדימה</span>
            </div>
          }
        </div>

        {/* Affiliate Benefit */}
        <div data-ev-id="ev_3cac40ca02">
          <label data-ev-id="ev_d49e780fa3" htmlFor={`${formId}-affiliate`} className="text-white/50 text-xs mb-1 flex items-center gap-1">
            <Gift className="w-3 h-3" aria-hidden="true" />
            הטבת שותפים
          </label>
          <input data-ev-id="ev_c1522d2485"
          id={`${formId}-affiliate`}
          value={affiliateBenefit}
          onChange={(e) => setAffiliateBenefit(e.target.value)}
          placeholder="למשל: 5$ חינם בהרשמה..."
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />

          <p data-ev-id="ev_2742b9e0e1" className="mt-0.5 text-white/25 text-[10px]">הטקסט שיופיע ליד הקישור עם אייקון 🎁</p>
        </div>
      </div>

      {/* Icon + Color + Animation */}
      <div data-ev-id="ev_a60327ad70" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Icon */}
        <div data-ev-id="ev_ffb1bef181">
          <label data-ev-id="ev_2a0b5264eb" id={`${formId}-icon-label`} className="text-white/50 text-xs mb-1 block">אייקון</label>
          <div data-ev-id="ev_22545cd7e8" className="relative">
            <button data-ev-id="ev_ecde35a772"
            type="button"
            onClick={() => setShowIcons(!showIcons)}
            aria-expanded={showIcons}
            aria-labelledby={`${formId}-icon-label`}
            aria-haspopup="listbox"
            className="w-full flex items-center gap-2 px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              <IconComponent className="w-4 h-4" style={{ color }} aria-hidden="true" />
              <span data-ev-id="ev_6ab563003d" className="truncate">{iconName}</span>
            </button>
            {showIcons &&
            <div data-ev-id="ev_2c8f68d402"
            role="listbox"
            aria-label="בחירת אייקון"
            className="mt-1 p-2 bg-black/80 border border-white/[0.1] rounded-lg max-h-48 overflow-y-auto grid grid-cols-6 gap-1 z-50 absolute inset-x-0"
            onKeyDown={(e) => {if (e.key === 'Escape') {e.stopPropagation();setShowIcons(false);}}}>

                {ICON_NAMES.map((name) => {
                const Ic = ICON_MAP[name];
                return (
                  <button data-ev-id="ev_fa88025667"
                  key={name}
                  role="option"
                  aria-selected={iconName === name}
                  aria-label={name}
                  onClick={() => {setIconName(name);setShowIcons(false);}}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${iconName === name ? 'bg-primary/20 ring-1 ring-primary/40' : ''}`}>

                      <Ic className="w-4 h-4 text-white/70" aria-hidden="true" />
                    </button>);

              })}
              </div>
            }
          </div>
        </div>

        {/* Color */}
        <div data-ev-id="ev_f8e5ea3399">
          <label data-ev-id="ev_56b9b310de" id={`${formId}-color-label`} className="text-white/50 text-xs mb-1 block">צבע</label>
          <div data-ev-id="ev_528fa810ec" role="radiogroup" aria-labelledby={`${formId}-color-label`} className="flex flex-wrap gap-1">
            {COLOR_PRESETS.map((c) =>
            <button data-ev-id="ev_022bd7ad9a"
            key={c}
            role="radio"
            aria-checked={color === c}
            aria-label={`צבע ${c}`}
            onClick={() => setColor(c)}
            className={`w-5 h-5 rounded-full border-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${color === c ? 'border-white scale-125' : 'border-transparent hover:scale-110'}`}
            style={{ background: c }} />

            )}
          </div>
        </div>

        {/* Animation */}
        <div data-ev-id="ev_209d848277">
          <label data-ev-id="ev_dfd234e9a4" htmlFor={`${formId}-anim`} className="text-white/50 text-xs mb-1 block">אנימציה</label>
          <select data-ev-id="ev_7d7888364e"
          id={`${formId}-anim`}
          value={animation}
          onChange={(e) => setAnimation(e.target.value)}
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 [&>option]:bg-gray-900">

            {ANIMATION_OPTIONS.map((a) =>
            <option data-ev-id="ev_ff2b5e82b0" key={a.value} value={a.value}>{a.label}</option>
            )}
          </select>
        </div>
      </div>

      {/* Visibility toggle */}
      <label data-ev-id="ev_bcd006e636" htmlFor={`${formId}-visible`} className="flex items-center gap-2 cursor-pointer">
        <input data-ev-id="ev_6d5b83aa7c" id={`${formId}-visible`} type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="rounded border-white/20 bg-white/[0.06] text-primary focus:ring-primary/50" />
        <span data-ev-id="ev_a448ec828c" className="text-white/60 text-sm">נראה באתר</span>
      </label>

      {/* Live preview */}
      {title.trim() &&
      <div data-ev-id="ev_d3853d7e5c" className="border border-white/[0.06] rounded-xl overflow-hidden">
          <div data-ev-id="ev_0d6971a271" className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.04] bg-white/[0.02]">
            <Eye className="w-3 h-3 text-white/25" aria-hidden="true" />
            <span data-ev-id="ev_6f68fdc921" className="text-white/30 text-[10px] font-medium">תצוגה מקדימה</span>
          </div>
          <div data-ev-id="ev_31f55b2083"
        className="p-3.5 flex items-center gap-3"
        style={{
          borderRight: `2px solid ${color}`,
          background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`
        }}>

            <div data-ev-id="ev_ae3c93bf7c"
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}10`, border: `1px solid ${color}25` }}>

              <AnimatedIcon icon={IconComponent} animation={animation as IconAnimation} color={color} isHovered={true} />
            </div>
            <div data-ev-id="ev_0af06b8e40" className="flex-1 min-w-0">
              <div data-ev-id="ev_85713d6fca" className="flex items-center gap-2">
                <span data-ev-id="ev_49b784415d" className="font-semibold text-sm truncate" style={{ color }}>{title}</span>
                {selectedTag && selectedTag.value &&
              <span data-ev-id="ev_130f7399e7"
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold border flex-shrink-0"
              style={{
                color: selectedTag.color,
                borderColor: `${selectedTag.color}30`,
                backgroundColor: `${selectedTag.color}10`
              }}>

                    {selectedTag.label}
                  </span>
              }
              </div>
              {subtitle &&
            <p data-ev-id="ev_2763edf948" className="text-sm mt-0.5 truncate" style={{ color: `${color}bb` }}>{subtitle}</p>
            }
              {affiliateBenefit &&
            <p data-ev-id="ev_6092270c46" className="text-[11px] mt-1 truncate text-amber-400/70 flex items-center gap-1">
                  <Gift className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                  {affiliateBenefit}
                </p>
            }
              {description &&
            <p data-ev-id="ev_ba950cda80" className="text-white/50 text-xs mt-1 line-clamp-1">{description}</p>
            }
            </div>
            <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: `${color}80` }} aria-hidden="true" />
          </div>
        </div>
      }

      {/* Actions */}
      <div data-ev-id="ev_58c7f9d4b8" className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
        <button data-ev-id="ev_3ccde69f10"
        onClick={handleSave}
        disabled={!canSave}
        aria-label="שמור קישור"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-transparent">

          <Save className="w-3.5 h-3.5" aria-hidden="true" />
          שמור
        </button>
        {url &&
        <a data-ev-id="ev_b9496cb86b" href={url} target="_blank" rel="noopener noreferrer" aria-label={`פתח קישור בחלון חדש: ${title || url}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            פתח
          </a>
        }
        <div data-ev-id="ev_b711c1be27" className="flex-1" />
        {link && onDelete &&
        <button data-ev-id="ev_96b533699c"
        onClick={onDelete}
        aria-label={`מחק קישור: ${link.title}`}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">

            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            מחק
          </button>
        }
      </div>
    </div>);

};