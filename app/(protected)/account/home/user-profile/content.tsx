'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';
import { Database } from '@/types/database';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useAuth } from '@/providers/auth-provider';
import { useProfile } from '@/providers/profile-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ContentLoader } from '@/components/common/content-loader';
import SomethingWrong from '@/components/common/somethingwrong';
import { ImageInput, ImageInputFile } from '@/components/image-input';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileWithSppg = Profile & {
  sppg?: Database['public']['Tables']['sppg']['Row'] | null;
};

export function PersonalInfo() {
  const { profile, isLoading, error } = useProfile();
  const [formData, setFormData] = useState<ProfileWithSppg | null>(profile);
  const [avatar, setAvatar] = useState<ImageInputFile[]>(
    profile?.avatar_url &&
      profile?.avatar_url !== 'null' &&
      profile?.avatar_url.trim() !== ''
      ? [{ dataURL: profile.avatar_url }]
      : [],
  );

  useEffect(() => {
    setFormData(profile);

    setAvatar(
      profile?.avatar_url &&
        profile?.avatar_url !== 'null' &&
        profile?.avatar_url.trim() !== ''
        ? [{ dataURL: profile.avatar_url }]
        : [],
    );
  }, [profile]);

  if (error) return <SomethingWrong />;
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[480px]">
        <ContentLoader />
      </div>
    );

  const handleSave = async () => {
    if (!formData) return;

    let avatarBase64: string | null = null;

    if (avatar.length > 0 && avatar[0].file) {
      // Ada file baru → convert ke base64
      const reader = new FileReader();
      avatarBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(avatar[0].file!);
      });
    } else if (avatar.length === 0) {
      // Avatar dihapus
      avatarBase64 = null;
    }

    // 🚫 Jangan kirim avatar_url lama, biar backend yang generate
    const { avatar_url, ...rest } = formData;
    const payload = {
      ...rest,
      avatarFileBase64: avatarBase64,
    };

    // Optimistic update
    const updatedFormData = {
      ...formData,
      avatar_url: avatar.length > 0 ? avatar[0].dataURL : null,
    };
    mutate('/api/profile', { data: [updatedFormData] }, false);

    toast.success('Profil berhasil diperbarui');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success)
        throw new Error(result.error || 'Gagal update profil');

      // ✅ Hanya refresh data kalau berhasil
      mutate('/api/profile');
    } catch (e) {
      toast.error('Gagal update backend: ' + (e as Error).message);
      // ❌ Jangan overwrite optimistic update dengan data lama
    }
  };

  if (!formData) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 flex items-center justify-center">
          <ImageInput
            value={avatar}
            onChange={(selectedAvatar) => setAvatar(selectedAvatar)}
          >
            {({ onImageUpload }) => (
              <div
                className="size-50 relative cursor-pointer"
                onClick={onImageUpload}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="shadow-xs text-secondary-foreground/80 hover:text-foreground absolute z-1 size-5 -top-0.5 -end-0.5 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAvatar([
                            {
                              dataURL: toAbsoluteUrl(`/media/add-poto.png`),
                            },
                          ]);
                        }}
                      >
                        <X className="size-3.25!" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Click to remove or revert</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div
                  className="relative w-48 h-48 border-2 border-green-500 rounded-lg overflow-hidden bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${toAbsoluteUrl(`/media/avatars/blank.png`)})`,
                  }}
                >
                  {avatar.length > 0 && (
                    <img
                      src={avatar[0].dataURL}
                      alt="avatar"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </ImageInput>
        </Card>

        {/* Informasi Akun */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Nama Lengkap</p>
              <p className="font-medium">{profile?.nama_lengkap || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Jabatan</p>
              <p className="font-medium">{profile?.jabatan || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Nama SPPG</p>
              <p className="font-medium">{profile?.sppg?.nama || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Alamat SPPG</p>
              <p className="font-medium">{profile?.sppg?.alamat || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cakupan Wilayah</p>
              <p className="font-medium">{profile?.sppg?.wilayah || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Jenis Pengguna</p>
              <p className="font-medium">{profile?.role_user || '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profil */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Nama Lengkap
              </label>
              <Input
                value={formData.nama_lengkap || ''}
                onChange={(e) =>
                  setFormData({ ...formData, nama_lengkap: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Role</label>
              <Input
                value={formData.role_user || ''}
                onChange={(e) =>
                  setFormData({ ...formData, role_user: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Nama SPPG</label>
              <Input
                value={formData.sppg?.nama || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sppg: { ...(formData.sppg! || {}), nama: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Alamat SPPG
              </label>
              <Input
                value={formData.sppg?.alamat || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sppg: { ...(formData.sppg! || {}), alamat: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Cakupan Wilayah
              </label>
              <Input
                value={formData.sppg?.wilayah || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sppg: {
                      ...(formData.sppg! || {}),
                      wilayah: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
