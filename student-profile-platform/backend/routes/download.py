from fastapi import APIRouter, HTTPException
from database import supabase
from pydantic import BaseModel
import re

router = APIRouter()

class DownloadRequest(BaseModel):
    url: str
    userId: str = None

def get_instagram_shortcode(url: str) -> str:
    match = re.search(r'(?:https?://)?(?:www\.)?instagram\.com/(?:p|reel|tv)/([A-Za-z0-9_-]+)', url)
    return match.group(1) if match else None

@router.post("/")
async def process_download(req: DownloadRequest):
    url = req.url
    user_id = req.userId

    shortcode = get_instagram_shortcode(url)
    if not shortcode:
        raise HTTPException(status_code=400, detail="Invalid Instagram URL. Must match instagram.com/reel/..., /p/..., or /tv/...")

    media_type = "reel"
    if "/p/" in url:
        # Determine media type based on shortcode length for demonstration
        media_type = "image" if len(shortcode) % 2 == 0 else "carousel"

    media_urls = []
    thumbnail = ""

    if media_type == "reel":
        media_urls = ["https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"]
        thumbnail = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=60"
    elif media_type == "image":
        media_urls = ["https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&auto=format&fit=crop&q=80"]
        thumbnail = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=60"
    else:
        media_urls = [
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1080&auto=format&fit=crop&q=80"
        ]
        thumbnail = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=60"

    payload = {
        "shortcode": shortcode,
        "media_url": url,
        "media_type": media_type,
        "thumbnail": thumbnail,
        "download_links": media_urls,
        "caption": f"Enjoy this high-resolution {media_type} extracted securely by Mellow. [Shortcode: {shortcode}]"
    }

    if user_id:
        # Check if user is banned
        user_res = supabase.table("users").select("is_banned").eq("id", user_id).execute()
        if user_res.data and user_res.data[0].get("is_banned"):
            raise HTTPException(status_code=403, detail="Your account has been banned.")

        res = supabase.table("downloads").insert({
            "user_id": user_id,
            "media_url": url,
            "thumbnail": thumbnail,
            "media_type": media_type
        }).execute()

        if res.data:
            payload["db_record_id"] = res.data[0]["id"]

    return payload
