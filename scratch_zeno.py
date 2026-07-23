import urllib.request
import re

url = "https://content-api.zeno.fm/s/rZAF2b"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        print(f"Status: {resp.status}")
        print("Finding links in Zeno page:")
        urls = set(re.findall(r'https?://[^\s"\'<>]+', content))
        for u in urls:
            if 'zeno' in u or 'stream' in u or 'audio' in u or 'mp3' in u:
                print(" ->", u)
        
        # Look for station key or audio mount
        mounts = re.findall(r'"[a-zA-Z0-9_-]{10,}"', content)
        print("Found mounts/tokens:", mounts[:10])
except Exception as e:
    print("Error:", e)
