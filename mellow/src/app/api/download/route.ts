import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Helper to extract shortcode from Instagram URL
function getInstagramShortcode(url: string): string | null {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const { url, userId } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const shortcode = getInstagramShortcode(url);
    if (!shortcode) {
      return NextResponse.json({ error: 'Invalid Instagram URL. Must match instagram.com/reel/..., /p/..., or /tv/...' }, { status: 400 });
    }

    // Determine type based on URL keywords
    let mediaType: 'reel' | 'image' | 'carousel' = 'reel';
    if (url.includes('/p/')) {
      // Simulate random selection between image and carousel for demonstration
      mediaType = shortcode.length % 2 === 0 ? 'image' : 'carousel';
    }

    // Create high-quality mock downloader payload with real working CDN files
    // This allows the user to test download actions directly
    let mediaUrls: string[] = [];
    let thumbnail = '';

    if (mediaType === 'reel') {
      mediaUrls = ['https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4'];
      thumbnail = 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=60';
    } else if (mediaType === 'image') {
      mediaUrls = ['https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&auto=format&fit=crop&q=80'];
      thumbnail = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=60';
    } else {
      mediaUrls = [
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1080&auto=format&fit=crop&q=80'
      ];
      thumbnail = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=60';
    }

    const payload = {
      shortcode,
      media_url: url,
      media_type: mediaType,
      thumbnail,
      download_links: mediaUrls,
      caption: `Enjoy this high-resolution ${mediaType} extracted securely by Mellow. [Shortcode: ${shortcode}]`,
    };

    // If a logged-in user triggered this, persist the download in Supabase
    if (userId) {
      const supabaseAdmin = getSupabaseAdmin();
      
      // Ensure user is not banned
      const { data: userProfile } = await supabaseAdmin
        .from('users')
        .select('is_banned')
        .eq('id', userId)
        .single();

      if (userProfile?.is_banned) {
        return NextResponse.json({ error: 'Your account has been banned.' }, { status: 403 });
      }

      const { data, error } = await supabaseAdmin
        .from('downloads')
        .insert({
          user_id: userId,
          media_url: url,
          thumbnail,
          media_type: mediaType,
        })
        .select()
        .single();

      if (error) {
        console.error('Database write error:', error);
      } else {
        return NextResponse.json({ ...payload, db_record_id: data.id });
      }
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
