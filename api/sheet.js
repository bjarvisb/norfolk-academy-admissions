// /api/sheet.js - Vercel proxy to Apps Script with secret key
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const SCRIPT_URL = process.env.APPS_SCRIPT_URL;
    const SECRET_KEY = process.env.APPS_SCRIPT_SECRET;
    
    if (!SCRIPT_URL || !SECRET_KEY) {
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error - missing APPS_SCRIPT_URL or APPS_SCRIPT_SECRET' 
      });
    }
    
    const action = req.query.action || req.body?.action;
    
    if (!action) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing action parameter' 
      });
    }
    
    const url = new URL(SCRIPT_URL);
    
    const options = {
      method: req.method,
      headers: { 
        'Content-Type': 'application/json'
      },
      redirect: 'follow'
    };
    
    if (req.method === 'GET') {
      // Add action, secret, and any other query params
      url.searchParams.set('action', action);
      url.searchParams.set('key', SECRET_KEY);
      if (req.query.id) {
        url.searchParams.set('id', req.query.id);
      }
    } else if (req.method === 'POST') {
      // Add secret to body
      options.body = JSON.stringify({
        ...req.body,
        key: SECRET_KEY
      });
    }
    
    const response = await fetch(url.toString(), options);
    const text = await response.text();
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      // If not JSON, return as text
      return res.status(200).send(text);
    }
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
