import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    const user = data?.user || null;
    return Response.json({
      success: true,
      user: user ? { id: user.id, email: user.email } : null,
    });
  } catch {
    return Response.json({ success: true, user: null });
  }
}
