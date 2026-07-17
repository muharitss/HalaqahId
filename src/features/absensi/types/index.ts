import { type AbsensiStatusType } from "../validation/absensi.schema";

export interface MonthlyAbsensiData {
  tanggal: string;
  data: {
    id_santri: number;
    id_sesi: number;
    status: AbsensiStatusType;
  }[];
}
