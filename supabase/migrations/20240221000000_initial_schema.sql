-- Initial schema for nVision Digital AI Links

-- Sections Table
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📌',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Links Table
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Globe',
  color TEXT NOT NULL DEFAULT '#06b6d4',
  animation TEXT NOT NULL DEFAULT 'float',
  favicon_url TEXT,
  affiliate_benefit TEXT,
  tag TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site Config Table
CREATE TABLE public.site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_title TEXT NOT NULL DEFAULT 'nVision Digital AI',
  site_description TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  welcome_text TEXT NOT NULL DEFAULT '',
  welcome_subtext TEXT NOT NULL DEFAULT '',
  affiliate_disclaimer_text TEXT NOT NULL DEFAULT '',
  theme_colors JSONB NOT NULL DEFAULT '{}'::jsonb,
  default_view INTEGER NOT NULL DEFAULT 1,
  selected_views JSONB NOT NULL DEFAULT '[1]'::jsonb,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Analytics Events Table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_target TEXT,
  page_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Log Table
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin TOTP Table
CREATE TABLE public.admin_totp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secret TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'Admin',
  is_active BOOLEAN NOT NULL DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_totp ENABLE ROW LEVEL SECURITY;

-- Public Access Policies
CREATE POLICY "Allow public read-only access to sections" ON public.sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Allow public read-only access to links" ON public.links FOR SELECT USING (is_visible = true);
CREATE POLICY "Allow public read-only access to site_config" ON public.site_config FOR SELECT USING (true);

-- Functions for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_sections_updated BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_links_updated BEFORE UPDATE ON public.links FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_site_config_updated BEFORE UPDATE ON public.site_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_admin_totp_updated BEFORE UPDATE ON public.admin_totp FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default site config
INSERT INTO public.site_config (id, site_title, tagline, welcome_text, welcome_subtext)
VALUES (1, 'nVision Digital AI', 'קהילת ה-AI של ישראל', 'ברוכים הבאים ל-nVision Links', 'כל הכלים, הקישורים והקהילות במקום אחד');
