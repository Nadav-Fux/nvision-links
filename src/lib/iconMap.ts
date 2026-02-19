import {
  MessageCircle, Radio, Send, Users, BookOpen, GraduationCap, Bot, Wand2,
  Image, Video, Mic, Code, PenTool, Globe, BrainCircuit, Facebook, Linkedin,
  Link as LinkIcon, ExternalLink, Star, Heart, Zap, Shield, Eye, Music,
  Camera, FileText, Newspaper, Headphones, Gamepad2, Rocket, Sparkles,
  Lightbulb, Target, Award, TrendingUp, DollarSign, ShoppingCart, MapPin,
  Phone, Mail, Instagram, Twitter, Youtube, Github, Twitch, Hash,
  Clapperboard, Tv, Palette, Cpu, Database, Terminal, Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  MessageCircle, Radio, Send, Users, BookOpen, GraduationCap, Bot, Wand2,
  Image, Video, Mic, Code, PenTool, Globe, BrainCircuit, Facebook, Linkedin,
  Link: LinkIcon, ExternalLink, Star, Heart, Zap, Shield, Eye, Music,
  Camera, FileText, Newspaper, Headphones, Gamepad2, Rocket, Sparkles,
  Lightbulb, Target, Award, TrendingUp, DollarSign, ShoppingCart, MapPin,
  Phone, Mail, Instagram, Twitter, Youtube, Github, Twitch, Hash,
  Clapperboard, Tv, Palette, Cpu, Database, Terminal, Smartphone,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || LinkIcon;
}

export const ANIMATION_OPTIONS = [
  { value: 'bounce', label: 'קפיצה' },
  { value: 'wiggle', label: 'רעד' },
  { value: 'pulse-grow', label: 'פעימה' },
  { value: 'spin-slow', label: 'סיבוב' },
  { value: 'float', label: 'ריחוף' },
  { value: 'swing', label: 'נדנוד' },
  { value: 'rubber', label: 'גומי' },
  { value: 'flash', label: 'הבזק' },
  { value: 'tilt', label: 'הטיה' },
  { value: 'breathe', label: 'נשימה' },
];

export const COLOR_PRESETS = [
  '#06b6d4', '#0088cc', '#25D366', '#10a37f', '#8b5cf6',
  '#ff6b6b', '#d4a574', '#3b82f6', '#7c3aed', '#22d3ee',
  '#1877F2', '#f97316', '#ef4444', '#eab308', '#84cc16',
];
