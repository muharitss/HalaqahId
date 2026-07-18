export interface LandingSection {
  id_section: number;
  section_key: string;
  title?: string;
  subtitle?: string;
  order: number;
  is_active: boolean;
}

export interface RedirectRule {
  id_redirect: number;
  from_path: string;
  to_path: string;
  status_code: number;
}
