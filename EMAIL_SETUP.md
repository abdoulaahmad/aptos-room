# Email Subscription Setup - Complete Guide

Your email subscription system is ready with automatic confirmation emails!

## ✅ What's Working

- Email form with validation
- Serverless API endpoint (`/api/subscribe`)
- Database storage (Supabase)
- Automatic confirmation emails (Resend)

## 🚀 Quick Setup

### Step 1: Resend (Confirmation Emails)

1. **Sign up at https://resend.com** (free - 3,000 emails/month)

2. **Get your API key:**
   - Go to **API Keys** in dashboard
   - Click **Create API Key**
   - Copy the key (starts with `re_`)

3. **Add to Vercel:**
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add:
     ```
     RESEND_API_KEY=re_your_key_here
     ```

### Step 2: Verify Domain (Optional but Recommended)

By default, emails are sent from `onboarding@resend.dev`. To use your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Add your domain (e.g., `aptosroom.com`)
4. Add the DNS records shown
5. Update the code to use `noreply@yourdomain.com`

### Step 3: Supabase (Email Storage)

Already configured! Your credentials are set up. Subscribers are saved to the `subscribers` table.

## 📧 Email Template

Subscribers receive a beautiful HTML email with:
- Welcome message
- AptosRoom branding
- Links to social media
- Information about what's next

## 🧪 Testing

1. **Local test:**
   ```bash
   npm run dev
   ```
   - Subscribe with your email
   - Check your inbox (including spam)

2. **Production test:**
   - Deploy to Vercel
   - Test on live site
   - Check Resend dashboard for delivery status

## 📊 View Results

### Subscribers (Supabase)
- Go to Supabase → **Table Editor** → `subscribers`

### Email Analytics (Resend)
- Go to Resend dashboard → **Emails**
- See delivery status, opens, clicks

## 🔧 Customization

### Change Email Content

Edit `api/subscribe.ts` - find the `html` section and customize:
- Subject line
- Email content
- Button text/links
- Colors and styling

### Change From Email Address

In `api/subscribe.ts`, line ~83, update:
```typescript
from: 'AptosRoom <noreply@yourdomain.com>',  // Use your verified domain
```

## ⚠️ Important Notes

- **Resend free tier:** 3,000 emails/month, 100/day
- **Default sender:** Uses `onboarding@resend.dev` until you verify your domain
- **Email deliverability:** Verify your domain for best results
- **Error handling:** Subscription still works even if email fails

## 🐛 Troubleshooting

**Emails not sending?**
1. Check RESEND_API_KEY in Vercel environment variables
2. Check Resend dashboard for errors
3. Look at Vercel function logs

**Emails going to spam?**
1. Verify your domain in Resend
2. Add SPF, DKIM records
3. Use a professional from-address

**Database errors?**
1. Verify SUPABASE_URL and SUPABASE_KEY
2. Check table exists with correct schema
3. Check Supabase logs

## 📈 Next Steps

1. **Verify your domain** in Resend for better deliverability
2. **Customize email template** with your branding
3. **Set up email campaigns** to notify subscribers of launch
4. **Export subscriber list** when ready to send updates

## 💡 Pro Tips

- Test emails with your own address first
- Monitor Resend analytics for engagement
- Keep emails concise and branded
- Include clear call-to-action
- Provide unsubscribe option (add later if needed)

---

Need help? Check:
- [Resend Docs](https://resend.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions)