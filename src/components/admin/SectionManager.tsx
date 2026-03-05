import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, GripVertical, Eye, EyeOff, Save, X, Loader2, Search, ChevronsUpDown, Copy, CheckSquare, Square, MousePointerClick } from 'lucide-react';
import { LinkEditor } from '@/components/admin/LinkEditor';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ICON_MAP } from '@/lib/iconMap';
import { CommunityIcon } from '@/components/icons/CommunityIcon';
import { CodeIcon } from '@/components/icons/CodeIcon';
import { BrainIcon } from '@/components/icons/BrainIcon';
import { MediaIcon } from '@/components/icons/MediaIcon';

/** Maps known section titles to animated SVG icons instead of raw emojis. */
const SECTION_ICON_MAP: Record<string, ReactNode> = {
  'קהילות וקבוצות': <CommunityIcon size={18} />,
  'כלי Vibe Coding': <CodeIcon size={18} />,
  'מודלים ותשתיות': <BrainIcon size={18} />,
  'גרפיקה, וידאו ואודיו': <MediaIcon size={18} />,
};
function getSectionDisplayIcon(title: string, fallbackEmoji: string): ReactNode {
  return SECTION_ICON_MAP[title] ?? <span className="text-lg">{fallbackEmoji}</span>;
}
import type { Tables } from '@/integrations/supabase/helpers';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent } from
'@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy } from
'@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SectionRow = Tables<'sections'>;
type LinkRow = Tables<'links'>;

interface SectionManagerProps {
  sections: SectionRow[];
  links: LinkRow[];
  loading: boolean;
  linkStats?: Record<string, number>;
  onCreateSection: (data: {title: string;emoji: string;}) => Promise<void>;
  onUpdateSection: (id: string, data: Partial<SectionRow>) => Promise<void>;
  onDeleteSection: (id: string) => Promise<void>;
  onMoveSection: (id: string, direction: 'up' | 'down') => Promise<void>;
  onReorderSections: (orderedIds: string[]) => Promise<void>;
  onCreateLink: (data: Partial<LinkRow>) => Promise<void>;
  onUpdateLink: (id: string, data: Partial<LinkRow>) => Promise<void>;
  onDeleteLink: (id: string) => Promise<void>;
  onMoveLink: (id: string, direction: 'up' | 'down', sectionId: string) => Promise<void>;
  onReorderLinks: (sectionId: string, orderedIds: string[]) => Promise<void>;
  onDuplicateSection?: (id: string) => Promise<void>;
  onDuplicateLink?: (id: string) => Promise<void>;
  onBulkDeleteLinks?: (ids: string[]) => Promise<void>;
  onBulkToggleLinks?: (ids: string[], visible: boolean) => Promise<void>;
}

/* ═══════ Sortable Link Row ═══════ */
const SortableLinkItem = ({
  link, onEdit, isSearching, clickCount, onDuplicate, bulkMode, isSelected, onToggleSelect









}: {link: LinkRow;onEdit: () => void;isSearching: boolean;clickCount?: number;onDuplicate?: () => void;bulkMode: boolean;isSelected: boolean;onToggleSelect: () => void;}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined
  };

  const Icon = ICON_MAP[link.icon_name] || ICON_MAP['Link'];

  return (
    <div data-ev-id="ev_6e6e7c19ec"
    ref={setNodeRef}
    style={style}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg group transition-colors ${
    isSelected ? 'bg-primary/[0.08] border border-primary/20' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`
    }
    role="listitem">

      {bulkMode ?
      <button data-ev-id="ev_e06f681d1e" onClick={onToggleSelect} aria-label={isSelected ? 'בטל בחירה' : 'בחר'}
      className="p-0.5 text-white/60 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
        </button> :

      <button data-ev-id="ev_7ea9a0ce79"
      className="touch-none cursor-grab active:cursor-grabbing p-0.5 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      aria-label={`גרור לסידור: ${link.title}`}
      {...attributes}
      {...listeners}>

          <GripVertical className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      }
      <div data-ev-id="ev_aa800ca63d"
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: `${link.color}20` }}>

        <Icon className="w-3.5 h-3.5" style={{ color: link.color }} aria-hidden="true" />
      </div>
      <div data-ev-id="ev_a625da1f4a" className="flex-1 min-w-0">
        <div data-ev-id="ev_8d98cdeccb" className="text-white/80 text-sm font-medium truncate">{link.title}</div>
        {link.subtitle && <div data-ev-id="ev_e82f462314" className="text-white/60 text-xs truncate">{link.subtitle}</div>}
      </div>
      {/* Click count badge */}
      {clickCount !== undefined && clickCount > 0 &&
      <span data-ev-id="ev_45c1f5fc57" className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400/70 text-[10px] font-mono flex-shrink-0" title={`${clickCount} קליקים`}>
          <MousePointerClick className="w-2.5 h-2.5" aria-hidden="true" />
          {clickCount}
        </span>
      }
      {!link.is_visible && <EyeOff className="w-3 h-3 text-white/60 flex-shrink-0" aria-label="מוסתר" />}
      <div data-ev-id="ev_a67fcbbaac" className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {onDuplicate &&
        <button data-ev-id="ev_a20ab405b8" onClick={onDuplicate} aria-label={`שכפל: ${link.title}`}
        className="p-1.5 text-white/60 hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
            <Copy className="w-3 h-3" aria-hidden="true" />
          </button>
        }
        <button data-ev-id="ev_a804e6f89f"
        onClick={onEdit}
        aria-label={`ערוך: ${link.title}`}
        className="p-1.5 text-white/60 hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

          <Edit2 className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </div>);

};

/* ═══════ Main SectionManager ═══════ */
export const SectionManager = ({
  sections, links, loading, linkStats,
  onCreateSection, onUpdateSection, onDeleteSection, onMoveSection, onReorderSections,
  onCreateLink, onUpdateLink, onDeleteLink, onMoveLink, onReorderLinks,
  onDuplicateSection, onDuplicateLink, onBulkDeleteLinks, onBulkToggleLinks
}: SectionManagerProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0]?.id || null);
  const [allExpanded, setAllExpanded] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSection, setNewSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionEmoji, setSectionEmoji] = useState('📁');
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [addingLinkTo, setAddingLinkTo] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Bulk mode
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;title: string;message: string;onConfirm: () => void;
  }>({ open: false, title: '', message: '', onConfirm: () => {} });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sectionLinks = (sectionId: string) =>
  links.filter((l) => l.section_id === sectionId).sort((a, b) => a.sort_order - b.sort_order);

  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.trim().toLowerCase();
  const filteredSectionLinks = (sectionId: string) => {
    const all = sectionLinks(sectionId);
    if (!isSearching) return all;
    return all.filter(
      (l) => l.title.toLowerCase().includes(q) || l.subtitle?.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
    );
  };

  const toggleExpandAll = () => {
    if (allExpanded) {setExpandedSection(null);setAllExpanded(false);} else {setAllExpanded(true);}
  };
  const isSectionExpanded = (sectionId: string) => {
    if (isSearching) return filteredSectionLinks(sectionId).length > 0;
    if (allExpanded) return true;
    return expandedSection === sectionId;
  };
  const handleToggleSection = (sectionId: string) => {
    if (allExpanded) {setAllExpanded(false);setExpandedSection(null);} else {
      setExpandedSection(expandedSection === sectionId ? null : sectionId);
    }
  };

  // Bulk helpers
  const toggleSelectLink = (id: string) => {
    setSelectedLinks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  };
  const selectAllInSection = (sectionId: string) => {
    const ids = sectionLinks(sectionId).map((l) => l.id);
    setSelectedLinks((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      if (allSelected) ids.forEach((id) => next.delete(id));else
      ids.forEach((id) => next.add(id));
      return next;
    });
  };
  const handleBulkDelete = () => {
    if (selectedLinks.size === 0 || !onBulkDeleteLinks) return;
    setConfirmDialog({
      open: true, title: 'מחיקת קישורים',
      message: `${selectedLinks.size} קישורים יימחקו לצמיתות.`,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        setActionLoading('bulk-delete');
        await onBulkDeleteLinks(Array.from(selectedLinks));
        setSelectedLinks(new Set());
        setActionLoading(null);
      }
    });
  };
  const handleBulkToggle = async (visible: boolean) => {
    if (selectedLinks.size === 0 || !onBulkToggleLinks) return;
    setActionLoading('bulk-toggle');
    await onBulkToggleLinks(Array.from(selectedLinks), visible);
    setSelectedLinks(new Set());
    setActionLoading(null);
  };
  const exitBulkMode = () => {setBulkMode(false);setSelectedLinks(new Set());};

  // Section CRUD
  const handleSaveNewSection = async () => {
    if (!sectionTitle.trim()) return;
    setActionLoading('new-section');
    await onCreateSection({ title: sectionTitle.trim(), emoji: sectionEmoji });
    setSectionTitle('');setSectionEmoji('📁');setNewSection(false);setActionLoading(null);
  };
  const handleSaveEditSection = async (id: string) => {
    if (!sectionTitle.trim()) return;
    setActionLoading(`edit-${id}`);
    await onUpdateSection(id, { title: sectionTitle.trim(), emoji: sectionEmoji });
    setEditingSection(null);setSectionTitle('');setActionLoading(null);
  };
  const startEditSection = (section: SectionRow) => {
    setEditingSection(section.id);setSectionTitle(section.title);setSectionEmoji(section.emoji);
  };
  const handleDeleteSection = async (id: string) => {
    const sLinks = sectionLinks(id);
    const section = sections.find((s) => s.id === id);
    const name = section?.title || 'סקציה';
    const msg = sLinks.length > 0 ?
    `הסקציה "${name}" מכילה ${sLinks.length} קישורים. כל הקישורים יימחקו לצמיתות.` :
    `הסקציה "${name}" תימחק לצמיתות.`;
    setConfirmDialog({
      open: true, title: 'מחיקת סקציה', message: msg, onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        setActionLoading(`del-${id}`);await onDeleteSection(id);setActionLoading(null);
      }
    });
  };

  // Link CRUD
  const handleSaveLink = async (data: Partial<LinkRow>) => {
    setActionLoading('save-link');
    if (editingLink) {await onUpdateLink(editingLink, data);setEditingLink(null);} else
    if (addingLinkTo) {await onCreateLink(data);setAddingLinkTo(null);}
    setActionLoading(null);
  };
  const handleDeleteLink = async (id: string) => {
    const link = links.find((l) => l.id === id);
    const name = link?.title || 'קישור';
    setConfirmDialog({
      open: true, title: 'מחיקת קישור', message: `הקישור "${name}" יימחק לצמיתות.`, onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        setActionLoading(`del-link-${id}`);await onDeleteLink(id);setEditingLink(null);setActionLoading(null);
      }
    });
  };

  // DnD
  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);
  const sectionIds = sortedSections.map((s) => s.id);

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionIds.indexOf(active.id as string);
    const newIndex = sectionIds.indexOf(over.id as string);
    const newIds = arrayMove(sectionIds, oldIndex, newIndex);
    onReorderSections(newIds);
  };

  const handleLinkDragEnd = (sectionId: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const linkIds = sectionLinks(sectionId).map((l) => l.id);
    const oldIndex = linkIds.indexOf(active.id as string);
    const newIndex = linkIds.indexOf(over.id as string);
    const newIds = arrayMove(linkIds, oldIndex, newIndex);
    onReorderLinks(sectionId, newIds);
  };

  // Get click count for a link title
  const getClickCount = (title: string): number | undefined => {
    if (!linkStats) return undefined;
    return linkStats[title] || 0;
  };

  return (
    <div data-ev-id="ev_efcd15aca5" className="space-y-3" dir="rtl" aria-live="polite">
      <ConfirmDialog
        open={confirmDialog.open} title={confirmDialog.title}
        message={confirmDialog.message} confirmLabel="מחק"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))} />

      {/* Search + bulk + expand */}
      <div data-ev-id="ev_bee09b9882" className="flex items-center gap-2">
        <div data-ev-id="ev_5fd6a071e4" className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" aria-hidden="true" />
          <label data-ev-id="ev_16532b336a" htmlFor="link-search" className="sr-only">חיפוש קישורים</label>
          <input data-ev-id="ev_5297c3fe00"
          id="link-search" type="search" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חיפוש קישורים..."
          className="w-full pr-10 pl-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/80 text-sm placeholder:text-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 focus:bg-white/[0.06] transition-all" />

          {isSearching &&
          <button data-ev-id="ev_2799f9290c" onClick={() => setSearchQuery('')} aria-label="נקה חיפוש" className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          }
        </div>
        {/* Bulk mode toggle */}
        {links.length > 0 &&
        <button data-ev-id="ev_01806c999a" onClick={bulkMode ? exitBulkMode : () => setBulkMode(true)}
        aria-label={bulkMode ? 'צא ממצב בחירה' : 'בחירה מרובה'}
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        bulkMode ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white/60'}`
        }>

            <CheckSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span data-ev-id="ev_adb6024747" className="hidden sm:inline">{bulkMode ? 'ביטול' : 'בחירה'}</span>
          </button>
        }
        {sections.length > 1 && !isSearching &&
        <button data-ev-id="ev_2f0cffb3b9" onClick={toggleExpandAll} aria-label={allExpanded ? 'כווץ הכל' : 'הרחב הכל'}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white/60 text-xs transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <ChevronsUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span data-ev-id="ev_192562ba0b" className="hidden sm:inline">{allExpanded ? 'כווץ' : 'הרחב'}</span>
          </button>
        }
      </div>

      {/* Bulk actions bar */}
      {bulkMode && selectedLinks.size > 0 &&
      <div data-ev-id="ev_e46bcc31c2" className="flex items-center gap-2 px-4 py-2.5 bg-primary/[0.06] border border-primary/20 rounded-xl">
          <span data-ev-id="ev_15ac1af2b8" className="text-primary text-xs font-medium">{selectedLinks.size} נבחרו</span>
          <div data-ev-id="ev_154afe5311" className="flex-1" />
          <button data-ev-id="ev_a86d910108" onClick={() => handleBulkToggle(false)} disabled={actionLoading === 'bulk-toggle'}
        className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <EyeOff className="w-3 h-3 inline ml-1" aria-hidden="true" />הסתר
          </button>
          <button data-ev-id="ev_2f492eb23a" onClick={() => handleBulkToggle(true)} disabled={actionLoading === 'bulk-toggle'}
        className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Eye className="w-3 h-3 inline ml-1" aria-hidden="true" />הצג
          </button>
          <button data-ev-id="ev_b3f6bc7091" onClick={handleBulkDelete} disabled={actionLoading === 'bulk-delete'}
        className="px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 border border-red-400/15 hover:border-red-400/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
            {actionLoading === 'bulk-delete' ? <Loader2 className="w-3 h-3 animate-spin inline ml-1" /> : <Trash2 className="w-3 h-3 inline ml-1" aria-hidden="true" />}
            מחק
          </button>
        </div>
      }

      {/* Empty state */}
      {sections.length === 0 && !newSection &&
      <div data-ev-id="ev_bfddc3bf48" className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div data-ev-id="ev_4ce3618918" className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary/40" aria-hidden="true" />
          </div>
          <p data-ev-id="ev_e5e3015c9e" className="text-white/60 text-sm">אין סקציות עדיין</p>
          <p data-ev-id="ev_539aa4d2f8" className="text-white/60 text-xs max-w-[250px]">צור את הסקציה הראשונה שלך כדי להתחיל להוסיף קישורים</p>
        </div>
      }

      {/* Search no results */}
      {isSearching && sections.length > 0 && sections.every((s) => filteredSectionLinks(s.id).length === 0) &&
      <div data-ev-id="ev_d2e50660f4" className="flex flex-col items-center justify-center py-8 gap-2 text-center">
          <Search className="w-6 h-6 text-white/15" aria-hidden="true" />
          <p data-ev-id="ev_9dd47e02dc" className="text-white/60 text-sm">לא נמצאו קישורים עבור "{searchQuery}"</p>
        </div>
      }

      {/* Sortable Sections */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          {sortedSections.map((section, idx) => {
            const visibleLinks = filteredSectionLinks(section.id);
            const totalLinks = sectionLinks(section.id);
            const isExpanded = isSectionExpanded(section.id);
            if (isSearching && visibleLinks.length === 0) return null;

            return (
              <SortableSectionCard
                key={section.id}
                section={section}
                idx={idx}
                totalSections={sortedSections.length}
                isEditing={editingSection === section.id}
                isExpanded={isExpanded}
                visibleLinks={visibleLinks}
                totalLinksCount={totalLinks.length}
                isSearching={isSearching}
                sectionTitle={sectionTitle}
                sectionEmoji={sectionEmoji}
                actionLoading={actionLoading}
                editingLink={editingLink}
                addingLinkTo={addingLinkTo}
                sensors={sensors}
                linkStats={linkStats}
                getClickCount={getClickCount}
                bulkMode={bulkMode}
                selectedLinks={selectedLinks}
                onToggle={() => handleToggleSection(section.id)}
                onStartEdit={() => startEditSection(section)}
                onSaveEdit={() => handleSaveEditSection(section.id)}
                onCancelEdit={() => setEditingSection(null)}
                onDelete={() => handleDeleteSection(section.id)}
                onToggleVisibility={() => onUpdateSection(section.id, { is_visible: !section.is_visible })}
                onMoveUp={() => onMoveSection(section.id, 'up')}
                onMoveDown={() => onMoveSection(section.id, 'down')}
                onSetTitle={setSectionTitle}
                onSetEmoji={setSectionEmoji}
                onEditLink={setEditingLink}
                onAddLink={() => setAddingLinkTo(section.id)}
                onSaveLink={handleSaveLink}
                onDeleteLink={handleDeleteLink}
                onCancelLinkEdit={() => {setEditingLink(null);setAddingLinkTo(null);}}
                onLinkDragEnd={handleLinkDragEnd(section.id)}
                onDuplicateSection={onDuplicateSection ? () => onDuplicateSection(section.id) : undefined}
                onDuplicateLink={onDuplicateLink}
                onToggleSelectLink={toggleSelectLink}
                onSelectAllInSection={() => selectAllInSection(section.id)} />);


          })}
        </SortableContext>
      </DndContext>

      {/* Add new section */}
      {newSection ?
      <div data-ev-id="ev_5afe5e776c" className="bg-white/[0.03] border border-primary/20 rounded-xl p-4">
          <h3 data-ev-id="ev_fd1be33a0a" className="text-white/70 text-sm font-medium mb-3">סקציה חדשה</h3>
          <div data-ev-id="ev_2d9432a358" className="flex items-center gap-2">
            <label data-ev-id="ev_d2135d1d53" htmlFor="new-section-emoji" className="sr-only">אימוג׳י</label>
            <input data-ev-id="ev_488581653f" id="new-section-emoji" value={sectionEmoji} onChange={(e) => setSectionEmoji(e.target.value)}
          className="w-12 px-2 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-center text-lg" maxLength={2} placeholder="📁" aria-label="אימוג׳י סקציה" />
            <label data-ev-id="ev_ce96f864f6" htmlFor="new-section-title" className="sr-only">שם הסקציה</label>
            <input data-ev-id="ev_37753d6fb2" id="new-section-title" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="שם הסקציה" autoFocus aria-label="שם הסקציה" />
            <button data-ev-id="ev_7bc5ad6308" onClick={handleSaveNewSection} disabled={!sectionTitle.trim() || actionLoading === 'new-section'}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {actionLoading === 'new-section' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'צור'}
            </button>
            <button data-ev-id="ev_47718acfaa" onClick={() => {setNewSection(false);setSectionTitle('');}} aria-label="ביטול" className="p-2 text-white/60 hover:text-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div> :

      <button data-ev-id="ev_0ff91a18a5" onClick={() => setNewSection(true)} aria-label="הוסף סקציה חדשה"
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/[0.1] text-white/60 hover:text-white/60 hover:border-white/[0.2] text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Plus className="w-4 h-4" /> הוסף סקציה
        </button>
      }
    </div>);

};

/* ═══════ Sortable Section Card ═══════ */
interface SortableSectionCardProps {
  section: SectionRow;idx: number;totalSections: number;
  isEditing: boolean;isExpanded: boolean;
  visibleLinks: LinkRow[];totalLinksCount: number;isSearching: boolean;
  sectionTitle: string;sectionEmoji: string;
  actionLoading: string | null;editingLink: string | null;addingLinkTo: string | null;
  sensors: ReturnType<typeof useSensors>;
  linkStats?: Record<string, number>;
  getClickCount: (title: string) => number | undefined;
  bulkMode: boolean;selectedLinks: Set<string>;
  onToggle: () => void;onStartEdit: () => void;onSaveEdit: () => void;onCancelEdit: () => void;
  onDelete: () => void;onToggleVisibility: () => void;onMoveUp: () => void;onMoveDown: () => void;
  onSetTitle: (v: string) => void;onSetEmoji: (v: string) => void;
  onEditLink: (id: string) => void;onAddLink: () => void;
  onSaveLink: (data: Partial<LinkRow>) => void;onDeleteLink: (id: string) => void;
  onCancelLinkEdit: () => void;onLinkDragEnd: (event: DragEndEvent) => void;
  onDuplicateSection?: () => void;onDuplicateLink?: (id: string) => Promise<void>;
  onToggleSelectLink: (id: string) => void;onSelectAllInSection: () => void;
}

const SortableSectionCard = (props: SortableSectionCardProps) => {
  const {
    section, idx, totalSections, isEditing, isExpanded,
    visibleLinks, totalLinksCount, isSearching,
    sectionTitle, sectionEmoji, actionLoading,
    editingLink, addingLinkTo, sensors, getClickCount,
    bulkMode, selectedLinks,
    onToggle, onStartEdit, onSaveEdit, onCancelEdit, onDelete, onToggleVisibility,
    onMoveUp, onMoveDown, onSetTitle, onSetEmoji,
    onEditLink, onAddLink, onSaveLink, onDeleteLink, onCancelLinkEdit, onLinkDragEnd,
    onDuplicateSection, onDuplicateLink, onToggleSelectLink, onSelectAllInSection
  } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined
  };

  const linkIds = visibleLinks.map((l) => l.id);

  return (
    <div data-ev-id="ev_4bdd234a57" ref={setNodeRef} style={style}
    className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden"
    role="region" aria-label={`סקציה: ${section.title}`}>

      {/* Section header */}
      <div data-ev-id="ev_b6e2c665dc" className="flex items-center gap-2 px-4 py-3">
        <button data-ev-id="ev_bf96520d01"
        className="touch-none cursor-grab active:cursor-grabbing p-0.5 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-label={`גרור לסידור: ${section.title}`}
        {...attributes} {...listeners}>

          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </button>

        {isEditing ?
        <div data-ev-id="ev_bc2bb0f361" className="flex-1 flex items-center gap-2">
            <input data-ev-id="ev_0314c81a93" value={sectionEmoji} onChange={(e) => onSetEmoji(e.target.value)}
          className="w-10 px-1 py-1 bg-white/[0.06] border border-white/[0.1] rounded text-center text-lg" maxLength={2} aria-label="אימוג׳י סקציה" />
            <input data-ev-id="ev_e57e2fdb23" value={sectionTitle} onChange={(e) => onSetTitle(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" autoFocus aria-label="שם הסקציה" />
            <button data-ev-id="ev_b868c288a4" onClick={onSaveEdit} disabled={actionLoading === `edit-${section.id}`} aria-label="שמור"
          className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {actionLoading === `edit-${section.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            </button>
            <button data-ev-id="ev_51002907b0" onClick={onCancelEdit} aria-label="ביטול" className="p-1.5 rounded-lg text-white/60 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <X className="w-3.5 h-3.5" />
            </button>
          </div> :

        <>
            <button data-ev-id="ev_33bb145f51" onClick={onToggle} aria-expanded={isExpanded}
          className="flex-1 flex items-center gap-2 text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
              <span data-ev-id="ev_4560251b43" className="flex items-center" aria-hidden="true">{getSectionDisplayIcon(section.title, section.emoji)}</span>
              <span data-ev-id="ev_a26d160601" className="text-white/90 font-medium text-sm">{section.title}</span>
              <span data-ev-id="ev_ac3139da31" className="text-white/60 text-xs">
                ({isSearching ? `${visibleLinks.length}/${totalLinksCount}` : totalLinksCount})
              </span>
              {!section.is_visible && <EyeOff className="w-3 h-3 text-white/60" aria-label="מוסתר" />}
            </button>
            <div data-ev-id="ev_cfa37cd376" className="flex items-center gap-1" role="toolbar" aria-label={`פעולות סקציה: ${section.title}`}>
              {bulkMode &&
            <button data-ev-id="ev_d998ab0785" onClick={onSelectAllInSection} aria-label="בחר הכל בסקציה"
            className="p-1.5 text-primary/50 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
            }
              {idx > 0 &&
            <button data-ev-id="ev_ebedad685d" onClick={onMoveUp} aria-label={`הזז למעלה: ${section.title}`} className="p-1.5 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
            }
              {idx < totalSections - 1 &&
            <button data-ev-id="ev_a4fbaeb7d0" onClick={onMoveDown} aria-label={`הזז למטה: ${section.title}`} className="p-1.5 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
            }
              <button data-ev-id="ev_a770764c4e" onClick={onToggleVisibility} aria-label={section.is_visible ? `הסתר: ${section.title}` : `הצג: ${section.title}`}
            className="p-1.5 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                {section.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              {onDuplicateSection &&
            <button data-ev-id="ev_ebcc53719b" onClick={onDuplicateSection} aria-label={`שכפל: ${section.title}`}
            className="p-1.5 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                  <Copy className="w-3.5 h-3.5" />
                </button>
            }
              <button data-ev-id="ev_65114438d8" onClick={onStartEdit} aria-label={`ערוך: ${section.title}`}
            className="p-1.5 text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button data-ev-id="ev_eb0df7acd7" onClick={onDelete} aria-label={`מחק: ${section.title}`}
            className="p-1.5 text-red-400/30 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded">
                {actionLoading === `del-${section.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </>
        }
      </div>

      {/* Links */}
      {isExpanded &&
      <div data-ev-id="ev_fe14417345" className="px-4 pb-4 space-y-2 border-t border-white/[0.05] pt-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onLinkDragEnd}>
            <SortableContext items={linkIds} strategy={verticalListSortingStrategy}>
              {visibleLinks.map((link) => {
              if (editingLink === link.id) {
                return <LinkEditor key={link.id} link={link} sectionId={section.id} onSave={onSaveLink} onDelete={() => onDeleteLink(link.id)} onCancel={onCancelLinkEdit} />;
              }
              return (
                <SortableLinkItem key={link.id} link={link}
                onEdit={() => onEditLink(link.id)} isSearching={isSearching}
                clickCount={getClickCount(link.title)}
                onDuplicate={onDuplicateLink ? () => onDuplicateLink(link.id) : undefined}
                bulkMode={bulkMode}
                isSelected={selectedLinks.has(link.id)}
                onToggleSelect={() => onToggleSelectLink(link.id)} />);


            })}
            </SortableContext>
          </DndContext>

          {visibleLinks.length === 0 && addingLinkTo !== section.id &&
        <div data-ev-id="ev_1d1e0ad0a6" className="flex items-center justify-center py-6 gap-2 text-center">
              <span data-ev-id="ev_f2b7aa5415" className="text-white/60 text-xs">אין קישורים בסקציה הזו</span>
            </div>
        }

          {addingLinkTo === section.id ?
        <LinkEditor sectionId={section.id} onSave={onSaveLink} onCancel={onCancelLinkEdit} /> :

        <button data-ev-id="ev_d59c1f86e3" onClick={onAddLink} aria-label={`הוסף קישור ל: ${section.title}`}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-white/[0.08] text-white/60 hover:text-white/70 hover:border-white/[0.15] text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Plus className="w-3.5 h-3.5" /> הוסף קישור
            </button>
        }
        </div>
      }
    </div>);

};