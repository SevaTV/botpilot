import crypto from 'crypto';

export default async function handler(req, res) {
    const { url, key, secret } = req.query;

    if (!url || !key || !secret) {
        return res.status(400).json({ error: 'Missing parameters (url, key, secret)' });
    }

    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.host;
        const path = parsedUrl.pathname;
        const query = parsedUrl.search.replace('?', '');
        const timestamp = Math.floor(Date.now() / 1000).toString();

        const method = 'GET';
        const hashedPayload = crypto.createHash('sha512').update('').digest('hex');
        
        const signString = `${method}\n${path}\n${query}\n${hashedPayload}\n${timestamp}`;
        const sign = crypto.createHmac('sha512', secret).update(signString).digest('hex');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'KEY': key,
                'SIGN': sign,
                'Timestamp': timestamp
            }
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
