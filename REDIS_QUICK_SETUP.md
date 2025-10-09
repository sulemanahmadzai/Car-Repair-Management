# ⚡ Redis Cache - Quick Setup (5 Minutes)

## Step 1: Get Free Redis from Upstash

1. Visit **https://upstash.com** and sign up (free, no credit card)
2. Click "**Create Database**"
3. Name it (e.g., "my-app-cache")
4. Choose region closest to your app
5. Click "**Create**"

## Step 2: Copy Your Credentials

On the database page, find the **REST API** section and copy:

```bash
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
```

## Step 3: Add to Your Environment

Create `.env.local` file (or add to existing `.env`):

```bash
# Redis Cache (Optional - app works without it)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
```

## Step 4: Restart Your App

```bash
pnpm dev
```

## ✅ That's It!

Your app now has **lightning-fast caching**!

Watch your console for cache logs:

```
[Cache MISS] customers:1:1:10
[Cache SET] customers:1:1:10 (TTL: 300s)
[Cache HIT] customers:1:1:10  ← 60-90% faster!
```

## 🚫 Skip Redis? No Problem!

Just **don't add** the environment variables. The app will work perfectly without caching.

---

**Want more details?** See [REDIS_CACHING_GUIDE.md](./REDIS_CACHING_GUIDE.md) for the full guide.
