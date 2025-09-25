import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('profiles').select('*, sppg(*)');

  console.log('Data from /api/profile:', data);

  if (error) {
    console.error('[API ERROR]', error);
    return Response.json({ success: false, error }, { status: 500 });
  }

  return Response.json({ success: true, data });
}

export async function PUT(req: Request) {
  const supabase = await createClient();
  try {
    const body = await req.json();
    const { sppg, avatarFileBase64, ...profileData } = body;

    if (!profileData.id_user) {
      return Response.json(
        { success: false, error: 'id_user wajib dikirim' },
        { status: 400 },
      );
    }

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
          })
          .select()
          .single();
        sppgId = newSppg.id;
      }
    }

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        avatar_url: avatarUrl,
        sppg_id: sppgId || null,
      })
      .eq('id_user', profileData.id_user);

    if (profileError)
      return Response.json(
        { success: false, error: profileError.message },
        { status: 500 },
      );

    return Response.json({ success: true });
  } catch (e) {
    return Response.json(
      { success: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
