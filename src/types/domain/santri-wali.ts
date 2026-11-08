export const HubunganWali = {
  AYAH: 'AYAH',
  IBU: 'IBU',
  KAKEK: 'KAKEK',
  NENEK: 'NENEK',
  PAMAN: 'PAMAN',
  WALI: 'WALI',
  LAINNYA: 'LAINNYA',
} as const;

export type HubunganWali = (typeof HubunganWali)[keyof typeof HubunganWali];

export const HUBUNGAN_WALI_LABELS: Record<HubunganWali, string> = {
  [HubunganWali.AYAH]: 'Ayah',
  [HubunganWali.IBU]: 'Ibu',
  [HubunganWali.KAKEK]: 'Kakek',
  [HubunganWali.NENEK]: 'Nenek',
  [HubunganWali.PAMAN]: 'Paman',
  [HubunganWali.WALI]: 'Wali',
  [HubunganWali.LAINNYA]: 'Lainnya',
};

export interface SantriWali {
  id_wali: number;
  id_santri: number;
  nama_wali: string;
  hubungan: HubunganWali;
  no_telepon?: string | null;
  email?: string | null;
  is_primary_contact: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSantriWaliRequest {
  nama_wali: string;
  hubungan: HubunganWali;
  no_telepon?: string | null;
  email?: string | null;
  is_primary_contact?: boolean;
}

export interface UpdateSantriWaliRequest {
  nama_wali?: string;
  hubungan?: HubunganWali;
  no_telepon?: string | null;
  email?: string | null;
  is_primary_contact?: boolean;
}
