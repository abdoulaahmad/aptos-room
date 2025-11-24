/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import type { VercelRequest, VercelResponse } from '@vercel/node';

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
