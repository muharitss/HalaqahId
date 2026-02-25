// Export semua type yang dibutuhkan
export interface ProgresSantri {
  id: number;
  nama: string;
  target: string;
  capaian: number;
  status: string;
  terakhirSetor: string;
  totalAyat: number;
}

export interface ProgresResponse {
  success: boolean;
  message: string;
  data: ProgresSantri[];
}