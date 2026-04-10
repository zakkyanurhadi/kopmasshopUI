const http = require('http');
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const raw = fs.readFileSync(filePath, 'utf8');
    raw.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const idx = trimmed.indexOf('=');
        if (idx < 1) return;
        const key = trimmed.slice(0, idx).trim();
        let value = trimmed.slice(idx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
    });
}

loadEnvFile(path.join(__dirname, '.env'));

const PORT = Number(process.env.LOCAL_PROXY_PORT || 8787);
const HOST = process.env.LOCAL_PROXY_HOST || '127.0.0.1';
const API_BASE_URL = process.env.API_BASE_URL || 'https://koperasi-umkm.privatedomain.site';
const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY || '';

if (!PUBLIC_API_KEY) {
    console.warn('[local-api-proxy] PUBLIC_API_KEY belum diset di .env');
}

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
        };

        if (PUBLIC_API_KEY) {
            upstreamHeaders['X-Public-Api-Key'] = PUBLIC_API_KEY;
        }

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

server.listen(PORT, HOST, () => {
    console.log(`Local API proxy running at http://${HOST}:${PORT}`);
});
