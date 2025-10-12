export interface Profile {
  id: string;
  id_user: string;
  nama_lengkap?: string | null;
  avatar_url?: string | null;
  created_at: string;
  sppg_id: string;
  jabatan?: string | null;
}

export interface Sppg {
  id: string; // uuid
  nama?: string | null;
  wilayah?: string | null;
  kecamatan?: string | null;
  alamat?: string | null;
  created_at: string;
}
