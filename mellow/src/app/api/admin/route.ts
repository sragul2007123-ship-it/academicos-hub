import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Helper to check if caller is admin
async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return false;

    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('user_role')
      .eq('id', user.id)
      .single();

    return profile?.user_role === 'admin';
  } catch (err) {
    console.error('Admin verification error:', err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch all users
    const { data: users, error: usersErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersErr) throw usersErr;

    // 2. Fetch overall downloads counts
    const { data: downloads, error: downloadsErr } = await supabaseAdmin
      .from('downloads')
      .select('media_type, downloaded_at');

    if (downloadsErr) throw downloadsErr;

    return NextResponse.json({
      users: users || [],
      downloadsCount: downloads?.length || 0,
      downloads: downloads || [],
    });
  } catch (error: any) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { targetUserId, isBanned } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target User ID is required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Check target user exists and is not admin
    const { data: targetProfile } = await supabaseAdmin
      .from('users')
      .select('user_role')
      .eq('id', targetUserId)
      .single();

    if (!targetProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (targetProfile.user_role === 'admin') {
      return NextResponse.json({ error: 'Cannot ban another administrator.' }, { status: 400 });
    }

    // 2. Update is_banned in public.users table
    const { data: updated, error } = await supabaseAdmin
      .from('users')
      .update({ is_banned: isBanned })
      .eq('id', targetUserId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, updatedUser: updated });
  } catch (error: any) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
