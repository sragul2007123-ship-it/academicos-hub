export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  user_role: 'user' | 'admin';
  is_banned: boolean;
  created_at: string;
}

export interface Download {
  id: string;
  user_id: string;
  media_url: string;
  thumbnail: string | null;
  media_type: 'reel' | 'image' | 'carousel';
  downloaded_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  download_id: string;
  created_at: string;
  download?: Download; // populated during join
}

export interface DashboardStats {
  totalDownloads: number;
  downloadsThisWeek: number;
  mostDownloadedType: 'reel' | 'image' | 'carousel' | 'N/A';
}

export interface AdminStats extends DashboardStats {
  totalUsers: number;
  bannedUsers: number;
}
