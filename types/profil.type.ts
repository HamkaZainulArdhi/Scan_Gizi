export interface Profile {
  id_user: string; // uuid
  nama_lengkap: string; // text NOT NULL
  avatar_url?: string | null; // text nullable
  role_user?: string; // USER-DEFINED enum (default 'mbg')
  created_at?: string | null; // timestamp with time zone
  sppg_id?: string | null; // uuid (nullable foreign key)
  id?: string | null; // uuid (sepertinya redundan dengan id_user)
  jabatan?: string | null; // text nullable
}

export interface Sppg {
  id: string; // uuid
  nama?: string | null; // varchar nullable
  wilayah?: string | null; // varchar nullable
  alamat?: string | null; // varchar nullable
  created_at: string; // timestamp with time zone NOT NULL
}
