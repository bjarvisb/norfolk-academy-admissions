// /api/auth.js
import crypto from 'crypto';

const TOKEN_TTL_DAYS = 30;

function signToken(payload, secret) {
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString('base64url');
  const sig = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyToken(token, secret) {
  try {
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return null;
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(encoded)
      .digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passcode } = req.body || {};
  if (!passcode || passcode !== process.env.COACH_PASSCODE) {
    return res.status(401).json({ error: 'Invalid passcode' });
  }

  const secret = process.env.TOKEN_SIGNING_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const payload = {
    exp: Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    iat: Date.now()
  };

  const token = signToken(payload, secret);
  return res.status(200).json({ token });
}
