const http = require('http');

const PORT = 8787;
const API_BASE_URL = 'https://koperasi-umkm.privatedomain.site';
const PUBLIC_API_KEY = 'WFpW4QvY5V3ctGH5Jb3zE5C7wCGWt8vS';

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        const incomingUrl = new URL(req.url, `http://${req.headers.host}`);

        if (!incomingUrl.pathname.startsWith('/proxy/')) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, message: 'Proxy route not found' }));
            return;
        }

        const targetPath = incomingUrl.pathname.replace('/proxy', '') + incomingUrl.search;
        const targetUrl = new URL(targetPath, API_BASE_URL).toString();

        const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await readBody(req);

        const upstreamHeaders = {
            'Accept': 'application/json',
            'X-Public-Api-Key': PUBLIC_API_KEY,
        };

        if (body) {
            upstreamHeaders['Content-Type'] = 'application/json';
        }

        const upstream = await fetch(targetUrl, {
            method: req.method,
            headers: upstreamHeaders,
            body,
        });

        const responseText = await upstream.text();
        const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';

        res.writeHead(upstream.status, { 'Content-Type': contentType });
        res.end(responseText);
    } catch (error) {
        res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            success: false,
            message: 'Proxy request failed',
            error: error.message,
        }));
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Local API proxy running at http://127.0.0.1:${PORT}`);
});
