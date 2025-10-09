// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import { mutate } from 'swr';
// import { Database } from '@/types/database';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';

// type Profile = Database['public']['Tables']['profiles']['Row'];
// type ProfileWithSppg = Profile & {
//   sppg?: Database['public']['Tables']['sppg']['Row'] | null;
// };

// interface PersonalEditProps {
//   profile: ProfileWithSppg | null;
//   avatarFile: File | null;
//   onAvatarChange: (file: File | null) => void;
// }

// export function PersonalEdit({
//   profile,
//   avatarFile,
//   onAvatarChange,
// }: PersonalEditProps) {
//   const [formData, setFormData] = useState<ProfileWithSppg | null>(profile);

//   // Sinkronisasi state lokal ketika props berubah
//   useEffect(() => {
//     setFormData(profile);
//   }, [profile]);

//   if (!formData) return null;

//   const handleSave = async () => {
//     if (!formData) return;
//     let avatarBase64: string | null = null;
//     if (avatarFile) {
//       const reader = new FileReader();
//       avatarBase64 = await new Promise<string>((resolve, reject) => {
//         reader.onload = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(avatarFile);
//       });
//     }

//     const payload = {
//       ...formData,
//       avatarFileBase64: avatarBase64,
//     };

//     // 1️⃣ Optimistic update: langsung ubah cache SWR parent
//     mutate('/api/profile', { data: [formData] }, false);

//     // 2️⃣ Beri feedback user
//     toast.success('Profil berhasil diperbarui');

//     // 3️⃣ Backend update di background
//     try {
//       await fetch('/api/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//     } catch (e) {
//       toast.error('Gagal update backend: ' + (e as Error).message);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Edit Profil</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-muted-foreground">
//               Nama Lengkap
//             </label>
//             <Input
//               value={formData.nama_lengkap || ''}
//               onChange={(e) =>
//                 setFormData({ ...formData, nama_lengkap: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <label className="text-sm text-muted-foreground">Role</label>
//             <Input
//               value={formData.role_user || ''}
//               onChange={(e) =>
//                 setFormData({ ...formData, role_user: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <label className="text-sm text-muted-foreground">Nama SPPG</label>
//             <Input
//               value={formData.sppg?.nama || ''}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   sppg: { ...(formData.sppg || {}), nama: e.target.value },
//                 })
//               }
//             />
//           </div>
//           <div>
//             <label className="text-sm text-muted-foreground">Alamat SPPG</label>
//             <Input
//               value={formData.sppg?.alamat || ''}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   sppg: { ...(formData.sppg || {}), alamat: e.target.value },
//                 })
//               }
//             />
//           </div>
//           <div>
//             <label className="text-sm text-muted-foreground">
//               Cakupan Wilayah
//             </label>
//             <Input
//               value={formData.sppg?.wilayah || ''}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   sppg: { ...(formData.sppg || {}), wilayah: e.target.value },
//                 })
//               }
//             />
//           </div>
//         </div>
//         <div className="flex justify-end mt-6">
//           <Button onClick={handleSave}>Simpan Perubahan</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
