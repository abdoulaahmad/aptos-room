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
          from: 'AptosRoom <noreply@aptosroom.app>',
          to: email,
          subject: '✨ Welcome to AptosRoom - Access Granted!',
          html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to AptosRoom</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; 
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                    color: #ffffff; 
                    margin: 0; 
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                  }
                  .email-wrapper { 
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                    padding: 40px 20px; 
                    min-height: 100vh;
                  }
                  .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: #050505;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 240, 255, 0.15);
                  }
                  .header-banner {
                    background: linear-gradient(135deg, #00F0FF 0%, #0080FF 100%);
                    padding: 3px;
                  }
                  .header { 
                    text-align: center; 
                    padding: 50px 30px 40px;
                    background: #050505;
                    position: relative;
                  }
                  .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 150px;
                    height: 150px;
                    background: radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%);
                    border-radius: 50%;
                  }
                  .logo-container {
                    margin-bottom: 25px;
                    position: relative;
                    z-index: 1;
                  }
                  .logo { 
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 15px;
                    background: linear-gradient(135deg, #00F0FF 0%, #0080FF 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    font-weight: 900;
                    color: #050505;
                    box-shadow: 0 10px 30px rgba(0, 240, 255, 0.3);
                  }
                  .brand-name {
                    font-size: 28px;
                    font-weight: 900;
                    letter-spacing: 2px;
                    background: linear-gradient(135deg, #00F0FF 0%, #ffffff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  }
                  .title { 
                    font-size: 36px; 
                    font-weight: 900; 
                    margin: 25px 0 15px;
                    background: linear-gradient(135deg, #00F0FF 0%, #00D4FF 50%, #0080FF 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.5px;
                    position: relative;
                    z-index: 1;
                  }
                  .subtitle {
                    font-size: 16px;
                    color: #a0a0a0;
                    font-weight: 400;
                  }
                  .content { 
                    background: #0a0a0a; 
                    border: 1px solid rgba(0, 240, 255, 0.1);
                    border-radius: 12px; 
                    padding: 35px 30px; 
                    margin: 0 30px 30px;
                  }
                  .content p { 
                    line-height: 1.7; 
                    color: #b0b0b0; 
                    margin: 18px 0;
                    font-size: 16px;
                  }
                  .welcome-text {
                    font-size: 18px;
                    color: #e0e0e0;
                    font-weight: 500;
                  }
                  .highlight { 
                    color: #00F0FF; 
                    font-weight: 700;
                    text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
                  }
                  .benefits-section {
                    background: linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 128, 255, 0.05) 100%);
                    border: 1px solid rgba(0, 240, 255, 0.15);
                    border-radius: 10px;
                    padding: 25px;
                    margin: 25px 0;
                  }
                  .benefits-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                  }
                  .benefits-title::before {
                    content: '✨';
                    margin-right: 10px;
                    font-size: 24px;
                  }
                  ul { 
                    list-style: none;
                    padding: 0;
                    margin: 0;
                  }
                  ul li { 
                    color: #b0b0b0; 
                    line-height: 1.9;
                    padding: 10px 0;
                    padding-left: 35px;
                    position: relative;
                    font-size: 15px;
                  }
                  ul li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(135deg, #00F0FF 0%, #0080FF 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .cta { 
                    text-align: center; 
                    padding: 0 30px 40px;
                  }
                  .button { 
                    display: inline-block; 
                    background: linear-gradient(135deg, #00F0FF 0%, #0080FF 100%);
                    color: #050505; 
                    padding: 16px 40px; 
                    border-radius: 30px; 
                    text-decoration: none; 
                    font-weight: 700;
                    font-size: 16px;
                    box-shadow: 0 10px 30px rgba(0, 240, 255, 0.4);
                    transition: all 0.3s ease;
                    letter-spacing: 0.5px;
                  }
                  .button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(0, 240, 255, 0.5);
                  }
                  .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.3) 50%, transparent 100%);
                    margin: 35px 0;
                  }
                  .footer { 
                    text-align: center; 
                    padding: 30px 30px 40px;
                    background: #0a0a0a;
                    border-top: 1px solid rgba(0, 240, 255, 0.1);
                  }
                  .footer-text {
                    color: #707070; 
                    font-size: 14px;
                    margin-bottom: 20px;
                  }
                  .social-links {
                    margin: 20px 0;
                  }
                  .social-links a { 
                    color: #00F0FF; 
                    text-decoration: none; 
                    margin: 0 12px;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s ease;
                  }
                  .social-links a:hover {
                    color: #ffffff;
                    text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
                  }
                  .tech-badge {
                    display: inline-block;
                    background: rgba(0, 240, 255, 0.1);
                    border: 1px solid rgba(0, 240, 255, 0.3);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #00F0FF;
                    margin-top: 15px;
                  }
                  @media only screen and (max-width: 600px) {
                    .email-wrapper { padding: 20px 10px; }
                    .header { padding: 40px 20px 30px; }
                    .content { padding: 25px 20px; margin: 0 15px 20px; }
                    .title { font-size: 28px; }
                    .cta { padding: 0 20px 30px; }
                  }
                </style>
              </head>
              <body>
                <div class="email-wrapper">
                  <div class="container">
                    <div class="header-banner"></div>
                    <div class="header">
                      <div class="logo-container">
                        <div class="logo">AR</div>
                        <div class="brand-name">APTOSROOM</div>
                      </div>
                      <h1 class="title">ACCESS GRANTED ✓</h1>
                      <p class="subtitle">Welcome to the Future of Decentralized Work</p>
                    </div>
                    
                    <div class="content">
                      <p class="welcome-text">Hello there! 👋</p>
                      
                      <p>You've successfully joined the <span class="highlight">AptosRoom Priority Waitlist</span>. You're now part of an exclusive community building the next generation of trustless talent ecosystems on the blockchain.</p>
                      
                      <div class="benefits-section">
                        <div class="benefits-title">What You'll Get</div>
                        <ul>
                          <li>🚀 First to know when we launch</li>
                          <li>🎁 Exclusive early access to platform features</li>
                          <li>💎 Founding member benefits and rewards</li>
                          <li>📰 Regular updates on development progress</li>
                          <li>🤝 Priority support from our team</li>
                        </ul>
                      </div>
                      
                      <div class="divider"></div>
                      
                      <p><strong style="color: #ffffff;">APTOS ROOM</strong> is more than just a platform—it's a thriving ecosystem where Web3 builders, developers, designers, and creators converge to contribute their talents to meaningful projects while earning rewards in a <span class="highlight">trustless environment</span>.</p>
                      
                      <p style="text-align: center; margin-top: 25px;">
                        <span class="tech-badge">⚡ Built on Aptos Move</span>
                      </p>
                    </div>
                    
                    <div class="cta">
                      <a href="https://aptosroom.app" class="button">🌐 Explore AptosRoom</a>
                    </div>
                    
                    <div class="footer">
                      <p class="footer-text">© 2025 AptosRoom • Built on Move</p>
                      <div class="social-links">
                        <a href="https://x.com/AptosRoom?s=09">𝕏 Twitter</a>
                        <a href="https://t.me/+nzOvO5pymwY2Zjhk">📱 Telegram</a>
                        <a href="https://discord.gg/CYVKTxyEvz">💬 Discord</a>
                      </div>
                      <p style="color: #505050; font-size: 12px; margin-top: 20px;">
                        You're receiving this because you subscribed to AptosRoom updates.
                      </p>
                    </div>
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
