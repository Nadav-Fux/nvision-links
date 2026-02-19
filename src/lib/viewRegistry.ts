import { lazy, type LazyExoticComponent, type ComponentType } from 'react';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

export interface ViewEntry {
  id: number;
  label: string;
  component: LazyExoticComponent<ComponentType<{ sections: (LinkSection | SectionWithLinks)[]; visible: boolean }>>;
  /** CSS class applied when this view is NOT active (exit animation) */
  exitClass: string;
  /** If true, disables global particle background */
  isCanvas?: boolean;
}

/**
 * Central registry for all 39 lazy-loaded views (View 1 = Grid is inline in Index.tsx).
 * Each entry must use a static import string — required for Vite code-splitting.
 *
 * To add a new view:
 *   1. Create src/components/MyView.tsx (export const MyView)
 *   2. Add entry here
 *   3. Add button in ViewToggle.tsx
 *   Done — Index.tsx picks it up automatically.
 */
export const VIEW_REGISTRY: ViewEntry[] = [
  { id: 2,  label: 'Stack',     component: lazy(() => import('@/components/StackView').then(m => ({ default: m.StackView }))),                 exitClass: '-translate-y-8' },
  { id: 3,  label: 'Flow',      component: lazy(() => import('@/components/CarouselView').then(m => ({ default: m.CarouselView }))),           exitClass: 'translate-y-8' },
  { id: 4,  label: 'Orbit',     component: lazy(() => import('@/components/OrbitView').then(m => ({ default: m.OrbitView }))),                 exitClass: 'scale-95' },
  { id: 5,  label: 'Deck',      component: lazy(() => import('@/components/RolodexView').then(m => ({ default: m.RolodexView }))),             exitClass: '-translate-y-8' },
  { id: 6,  label: 'Neural',    component: lazy(() => import('@/components/NeuralMapView').then(m => ({ default: m.NeuralMapView }))),         exitClass: 'translate-y-8', isCanvas: true },
  { id: 7,  label: 'Terminal',  component: lazy(() => import('@/components/TerminalView').then(m => ({ default: m.TerminalView }))),           exitClass: '-translate-y-8' },
  { id: 8,  label: 'Chat',      component: lazy(() => import('@/components/ChatView').then(m => ({ default: m.ChatView }))),                   exitClass: 'translate-y-8' },
  { id: 9,  label: 'IDE',       component: lazy(() => import('@/components/IDEView').then(m => ({ default: m.IDEView }))),                     exitClass: '-translate-y-8' },
  { id: 10, label: 'Phone',     component: lazy(() => import('@/components/PhoneView').then(m => ({ default: m.PhoneView }))),                 exitClass: 'scale-95' },
  { id: 11, label: 'Control',   component: lazy(() => import('@/components/MissionControlView').then(m => ({ default: m.MissionControlView }))), exitClass: 'translate-y-8' },
  { id: 12, label: 'Stars',     component: lazy(() => import('@/components/ConstellationView').then(m => ({ default: m.ConstellationView }))), exitClass: 'scale-95', isCanvas: true },
  { id: 13, label: 'Circuit',   component: lazy(() => import('@/components/CircuitBoardView').then(m => ({ default: m.CircuitBoardView }))),   exitClass: 'translate-y-8', isCanvas: true },
  { id: 14, label: 'RPG',       component: lazy(() => import('@/components/SkillTreeView').then(m => ({ default: m.SkillTreeView }))),         exitClass: 'scale-95' },
  { id: 15, label: 'Atoms',     component: lazy(() => import('@/components/MolecularView').then(m => ({ default: m.MolecularView }))),         exitClass: 'scale-95' },
  { id: 16, label: 'Table',     component: lazy(() => import('@/components/PeriodicTableView').then(m => ({ default: m.PeriodicTableView }))), exitClass: 'translate-y-8' },
  { id: 17, label: 'Ocean',     component: lazy(() => import('@/components/AquariumView').then(m => ({ default: m.AquariumView }))),           exitClass: 'scale-95' },
  { id: 18, label: 'Radar',     component: lazy(() => import('@/components/RadarView').then(m => ({ default: m.RadarView }))),                 exitClass: 'scale-95' },
  { id: 19, label: 'NN',        component: lazy(() => import('@/components/NeuralNetworkView').then(m => ({ default: m.NeuralNetworkView }))), exitClass: 'scale-95' },
  { id: 20, label: 'Stream',    component: lazy(() => import('@/components/StreamingView').then(m => ({ default: m.StreamingView }))),         exitClass: 'translate-y-8' },
  { id: 21, label: 'Dash',      component: lazy(() => import('@/components/DashboardView').then(m => ({ default: m.DashboardView }))),         exitClass: 'translate-y-8' },
  { id: 22, label: 'Secret',    component: lazy(() => import('@/components/ClassifiedView').then(m => ({ default: m.ClassifiedView }))),       exitClass: 'translate-y-8' },
  { id: 23, label: 'Spotify',   component: lazy(() => import('@/components/SpotifyView').then(m => ({ default: m.SpotifyView }))),             exitClass: 'translate-y-8' },
  { id: 24, label: 'News',      component: lazy(() => import('@/components/NewspaperView').then(m => ({ default: m.NewspaperView }))),         exitClass: 'translate-y-8' },
  { id: 25, label: 'Metro',     component: lazy(() => import('@/components/MetroMapView').then(m => ({ default: m.MetroMapView }))),           exitClass: 'scale-95' },
  { id: 26, label: 'Arcade',    component: lazy(() => import('@/components/ArcadeView').then(m => ({ default: m.ArcadeView }))),               exitClass: 'scale-95' },
  { id: 27, label: 'Desktop',   component: lazy(() => import('@/components/DesktopView').then(m => ({ default: m.DesktopView }))),             exitClass: 'scale-95' },
  { id: 28, label: 'AI',        component: lazy(() => import('@/components/AIPlaygroundView').then(m => ({ default: m.AIPlaygroundView }))),   exitClass: 'translate-y-8' },
  { id: 29, label: 'Holo',      component: lazy(() => import('@/components/HologramView').then(m => ({ default: m.HologramView }))),           exitClass: 'scale-95' },
  { id: 30, label: 'MRI',       component: lazy(() => import('@/components/BrainMRIView').then(m => ({ default: m.BrainMRIView }))),           exitClass: 'translate-y-8' },
  { id: 31, label: 'Prompt',    component: lazy(() => import('@/components/PromptFlowView').then(m => ({ default: m.PromptFlowView }))),       exitClass: 'translate-y-8' },
  { id: 32, label: 'GPU',       component: lazy(() => import('@/components/GPUClusterView').then(m => ({ default: m.GPUClusterView }))),       exitClass: 'translate-y-8' },
  { id: 33, label: 'Train',     component: lazy(() => import('@/components/TrainingDashView').then(m => ({ default: m.TrainingDashView }))),   exitClass: 'translate-y-8' },
  { id: 34, label: 'Robot',     component: lazy(() => import('@/components/RobotFactoryView').then(m => ({ default: m.RobotFactoryView }))),   exitClass: 'scale-95' },
  { id: 35, label: 'DNA',       component: lazy(() => import('@/components/DNAHelixView').then(m => ({ default: m.DNAHelixView }))),           exitClass: 'scale-95' },
  { id: 36, label: 'Satellite', component: lazy(() => import('@/components/SatelliteView').then(m => ({ default: m.SatelliteView }))),         exitClass: 'translate-y-8' },
  { id: 37, label: 'Wormhole',  component: lazy(() => import('@/components/WormholeView').then(m => ({ default: m.WormholeView }))),           exitClass: 'scale-95' },
  { id: 38, label: 'Stock',     component: lazy(() => import('@/components/StockTickerView').then(m => ({ default: m.StockTickerView }))),     exitClass: 'translate-y-8' },
  { id: 39, label: 'Blueprint', component: lazy(() => import('@/components/BlueprintView').then(m => ({ default: m.BlueprintView }))),         exitClass: 'translate-y-8' },
  { id: 40, label: 'Quantum',   component: lazy(() => import('@/components/QuantumView').then(m => ({ default: m.QuantumView }))),             exitClass: 'scale-95' },
];

/** Label map for all 40 views (including Grid) */
export const VIEW_LABELS: Record<number, string> = {
  1: 'Grid',
  ...Object.fromEntries(VIEW_REGISTRY.map(v => [v.id, v.label])),
};

/** Set of view IDs that use their own canvas (disables global particle background) */
export const CANVAS_VIEW_IDS = new Set(
  VIEW_REGISTRY.filter(v => v.isCanvas).map(v => v.id)
);
