import urllib.request
import json
import re

# Test direct Zeno Play endpoints
endpoints = [
    "https://api.zeno.fm/v2/stations/rZAF2b",
    "https://api.zeno.fm/v2/mounts/rZAF2b",
    "https://zenoplay.zenomedia.com/api/zeno/v2/stations/rZAF2b",
    "https://content-api.zeno.fm/s/rZAF2b",
    "https://stream.zeno.fm/rZAF2b",
    "https://stream-zeno.zenomedia.com/rZAF2b"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

for ep in endpoints:
    try:
        req = urllib.request.Request(ep, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read().decode('utf-8', errors='ignore')
            print(f"\n=== SUCCESS: {ep} (Status {resp.status}) ===")
            print(data[:500])
            
            # Find stream URLs
            streams = re.findall(r'https?://[^\s"\'<>]+\.mp3[^\s"\'<>]*|https?://stream[^\s"\'<>]+', data)
            if streams:
                print("Found streams:", streams)
    except Exception as e:
        print(f"Failed {ep}: {e}")
