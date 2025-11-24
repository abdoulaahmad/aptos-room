/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // If using Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email,
          subscribed_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Supabase error:', error);
        
        // Check if email already exists
        if (response.status === 409 || error.includes('duplicate')) {
          return res.status(409).json({ error: 'Email already subscribed' });
        }
        
        throw new Error('Failed to save subscriber');
      }
    } else {
      // Fallback: just log to console (for testing without database)
      console.log('New subscriber:', email, new Date().toISOString());
      console.warn('No database configured. Set SUPABASE_URL and SUPABASE_KEY environment variables.');
    }

    // Send confirmation email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: 'AptosRoom <onboarding@resend.dev>', // Use your verified domain or resend.dev for testing
          to: email,
          subject: 'Welcome to AptosRoom Waitlist! 🚀',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #050505; color: #ffffff; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                  .header { text-align: center; margin-bottom: 40px; }
                  .logo { font-size: 24px; font-weight: bold; color: #00F0FF; margin-bottom: 10px; }
                  .title { font-size: 32px; font-weight: bold; margin: 20px 0; background: linear-gradient(to right, #00F0FF, #0080FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                  .content { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 30px; margin: 20px 0; }
                  .content p { line-height: 1.6; color: #a0a0a0; margin: 15px 0; }
                  .highlight { color: #00F0FF; font-weight: 600; }
                  .cta { text-align: center; margin: 30px 0; }
                  .button { display: inline-block; background: #00F0FF; color: #050505; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
                  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #1a1a1a; color: #606060; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">APTOSROOM</div>
                    <h1 class="title">ACCESS GRANTED ✓</h1>
                  </div>
                  
                  <div class="content">
                    <p>Welcome to the future of decentralized work!</p>
                    
                    <p>You've successfully joined the <span class="highlight">AptosRoom Priority Waitlist</span>. You're now part of an exclusive community building the next generation of trustless talent ecosystems.</p>
                    
                    <p><strong>What happens next?</strong></p>
                    <ul style="color: #a0a0a0; line-height: 1.8;">
                      <li>🔔 You'll be first to know when we launch</li>
                      <li>🎁 Early access to platform features</li>
                      <li>💎 Exclusive founding member benefits</li>
                      <li>📧 Updates on development progress</li>
                    </ul>
                    
                    <p>Built on <span class="highlight">Aptos Move</span>, we're creating a platform where Web3 builders, developers, designers, and creators converge to contribute their talents while earning rewards in a completely trustless environment.</p>
                  </div>
                  
                  <div class="cta">
                    <a href="https://aptos-room.vercel.app" class="button">Visit AptosRoom</a>
                  </div>
                  
                  <div class="footer">
                    <p>© 2025 AptosRoom. Built on Move.</p>
                    <p style="margin-top: 10px;">
                      <a href="https://x.com/AptosRoom?s=09" style="color: #00F0FF; text-decoration: none; margin: 0 10px;">Twitter</a>
                      <a href="https://t.me/+nzOvO5pymwY2Zjhk" style="color: #00F0FF; text-decoration: none; margin: 0 10px;">Telegram</a>
                      <a href="https://discord.gg/CYVKTxyEvz" style="color: #00F0FF; text-decoration: none; margin: 0 10px;">Discord</a>
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `
        });
        
        console.log('Confirmation email sent to:', email);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the subscription if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not set. Confirmation email not sent.');
    }

    return res.status(200).json({ 
      success: true,
      message: 'Successfully subscribed to newsletter!' 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ 
      error: 'Failed to subscribe. Please try again later.' 
    });
  }
}
