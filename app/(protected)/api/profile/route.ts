import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  // Get profile data for authenticated user
  const { data, error } = await supabase
    .from('profiles')
    .select('*, sppg(*)')
    .eq('id_user', user.id)
    .maybeSingle();
  console.log('ambil dari provile undah:', data);
  if (error) {
    console.error('[API ERROR]', error);
    return Response.json({ success: false, error }, { status: 500 });
  }

  return Response.json({ success: true, data });
}

export async function PUT(req: Request) {
  const supabase = await createClient();
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { sppg, avatarFileBase64, ...profileData } = body;

    // Upload avatar jika ada
    let avatarUrl = profileData.avatar_url;
    if (avatarFileBase64) {
      const fileBuffer = Buffer.from(avatarFileBase64.split(',')[1], 'base64');
      const ext = avatarFileBase64.split(';')[0].split('/')[1] || 'png';

      // 🔑 Sama dengan nutrition_scans: timestamp + random
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 12)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(fileName, fileBuffer, { upsert: false });

      if (uploadError)
        return Response.json(
          { success: false, error: uploadError.message },
          { status: 500 },
        );

      avatarUrl = supabase.storage.from('avatar').getPublicUrl(data.path)
        .data.publicUrl;
    }

    // Update/insert sppg
    let sppgId = profileData.sppg_id;
    if (sppg) {
      if (sppg.id) {
        await supabase
          .from('sppg')
          .update({
            nama: sppg.nama,
            alamat: sppg.alamat,
            wilayah: sppg.wilayah,
            kecamatan: sppg.kecamatan,
          })
          .eq('id', sppg.id);
        sppgId = sppg.id;
      } else {
        const { data: newSppg } = await supabase
          .from('sppg')
          .insert({
            nama: sppg.nama,
            alamat: sppg.alamat,
            wilayah: sppg.wilayah,
            kecamatan: sppg.kecamatan,
          })
          .select()
          .single();
        sppgId = newSppg.id;
      }
    }

    // Try to update existing profile first
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id_user: user.id, // Always use authenticated user's ID
        ...profileData,
        avatar_url: avatarUrl,
        sppg_id: sppgId || null,
      })
      .select('*, sppg(*)')
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return Response.json(
        { success: false, error: updateError.message },
        { status: 500 },
      );
    }

    return Response.json({ success: true, data: updatedProfile });
  } catch (e) {
    console.error('API error:', e);
    return Response.json(
      { success: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
