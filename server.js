const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const FALLBACK_PORT = 3001;
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.txt': 'text/plain; charset=UTF-8'
};

const ALLOWED_CATEGORIES = new Set([
    'Dividend Query',
    'Demat / Share Transfer',
    'Financial Results & Reports',
    'Institutional Investor Inquiry',
    'Career Query',
    'Other Inquiry',
    'General Inquiry'
]);

// ==========================================
// RATE LIMITING CONFIGURATION FOR API
// ==========================================
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // Max 15 submissions per minute per IP
const ipRequestCounts = new Map();

// Periodic cleanup of expired rate limit entries
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestCounts.entries()) {
        if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
            ipRequestCounts.delete(ip);
        }
    }
}, RATE_LIMIT_WINDOW_MS);

function isRateLimited(ip) {
    const now = Date.now();
    const clientData = ipRequestCounts.get(ip);
    if (!clientData || (now - clientData.startTime) > RATE_LIMIT_WINDOW_MS) {
        ipRequestCounts.set(ip, { count: 1, startTime: now });
        return false;
    }
    clientData.count += 1;
    return clientData.count > MAX_REQUESTS_PER_WINDOW;
}

// ==========================================
// INPUT SANITIZATION & SECURITY UTILITIES
// ==========================================
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function sanitizeText(str, maxLength = 255) {
    if (typeof str !== 'string') return '';
    // Strip null bytes and non-printable control characters (allow \n and \t)
    let cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    cleaned = cleaned.trim();
    return cleaned.slice(0, maxLength);
}

function isValidEmail(email) {
    if (!email || typeof email !== 'string' || email.length > 254) return false;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '127.0.0.1';
}

function getNetworkIp() {
    try {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    } catch (e) {
        // Ignore network lookup errors
    }
    return null;
}

function setSecurityAndCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://translate.google.com https://www.googletagmanager.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com; " +
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: https://server.arcgisonline.com https://*.tile.openstreetmap.org https://translate.google.com https://www.google.com; " +
        "connect-src 'self' https://api.rss2json.com https://translate.google.com; " +
        "frame-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self';"
    );
}

// ==========================================
// INVESTOR QUERY BACKEND HANDLER (SANITIZED)
// ==========================================
function handleInvestorQuery(req, res) {
    const clientIp = getClientIp(req);

    // 1. Rate Limiting Check
    if (isRateLimited(clientIp)) {
        setSecurityAndCorsHeaders(res);
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: false, 
            error: 'Too many requests. Please wait a minute before submitting again.' 
        }));
        return;
    }

    // 2. Enforce Content-Type header
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
        setSecurityAndCorsHeaders(res);
        res.writeHead(415, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Unsupported Media Type: application/json required' }));
        return;
    }

    let body = '';
    let isDestroyed = false;

    req.on('data', chunk => {
        if (isDestroyed) return;
        body += chunk;
        if (body.length > 50000) { // 50KB payload limit (plenty for text form)
            isDestroyed = true;
            setSecurityAndCorsHeaders(res);
            if (!res.headersSent) {
                res.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Payload too large (max 50KB)' }));
            }
            req.destroy();
        }
    });

    req.on('error', err => {
        if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.message === 'aborted') return;
        console.warn('[Investor Query Stream Error]:', err.message);
    });

    req.on('end', () => {
        if (isDestroyed) return;
        try {
            // Prevent Prototype Pollution
            const rawPayload = JSON.parse(body || '{}');
            if (typeof rawPayload !== 'object' || rawPayload === null || Array.isArray(rawPayload)) {
                setSecurityAndCorsHeaders(res);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON body format' }));
                return;
            }

            // Extract and strictly sanitize inputs
            const rawFullName = sanitizeText(rawPayload.fullName, 100);
            const rawEmail = sanitizeText(rawPayload.email, 254);
            const rawFolio = sanitizeText(rawPayload.folioNo, 50);
            const rawCategory = sanitizeText(rawPayload.category, 100);
            const rawMessage = sanitizeText(rawPayload.message, 2000);

            // Validation Checks
            if (!rawFullName || rawFullName.length < 2) {
                setSecurityAndCorsHeaders(res);
                res.writeHead(422, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Full Name must be at least 2 characters long' }));
                return;
            }

            if (!isValidEmail(rawEmail)) {
                setSecurityAndCorsHeaders(res);
                res.writeHead(422, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid Email Address format' }));
                return;
            }

            if (!rawMessage || rawMessage.length < 5) {
                setSecurityAndCorsHeaders(res);
                res.writeHead(422, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Message must be at least 5 characters long' }));
                return;
            }

            // Category whitelist check
            const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : 'General Inquiry';

            // HTML Entity Escaped Record for safe storage & rendering
            const sanitizedRecord = {
                query: {
                    fullName: escapeHtml(rawFullName),
                    email: escapeHtml(rawEmail),
                    folioNo: escapeHtml(rawFolio),
                    category: escapeHtml(category),
                    message: escapeHtml(rawMessage),
                    clientIp: clientIp === '::1' ? '127.0.0.1' : clientIp,
                    time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeZoneName: 'short' })
                }
            };

            const queryDir = path.join(ROOT_DIR, 'query');
            if (!fs.existsSync(queryDir)) {
                fs.mkdirSync(queryDir, { recursive: true });
            }

            const queryFile = path.join(queryDir, 'investor_queries.json');
            let queryList = [];
            if (fs.existsSync(queryFile)) {
                try {
                    const existingData = fs.readFileSync(queryFile, 'utf8').trim();
                    queryList = existingData ? JSON.parse(existingData) : [];
                    if (!Array.isArray(queryList)) queryList = [];
                } catch (e) {
                    queryList = [];
                }
            }

            queryList.unshift(sanitizedRecord);
            // Limit stored records to last 500 to prevent unbounded disk growth
            if (queryList.length > 500) {
                queryList = queryList.slice(0, 500);
            }

            fs.writeFileSync(queryFile, JSON.stringify(queryList, null, 2), 'utf8');

            console.log(`[Investor Query] Saved sanitized inquiry from: ${rawFullName} <${rawEmail}>`);

            setSecurityAndCorsHeaders(res);
            if (!res.headersSent) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: sanitizedRecord }));
            }
        } catch (err) {
            setSecurityAndCorsHeaders(res);
            if (!res.headersSent) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload' }));
            }
        }
    });
}

function safeDecodePathname(rawPath) {
    if (!rawPath) return '/index.html';

    // Strip null bytes immediately to prevent null-byte injection attacks
    const clean = rawPath.replace(/\0/g, '');

    try {
        return decodeURIComponent(clean);
    } catch (e) {
        // If decodeURIComponent throws URIError (malformed % sequence from Burp Suite scan)
        try {
            return clean.replace(/%(?![0-9a-fA-F]{2})/g, '%25');
        } catch (err) {
            return null;
        }
    }
}

function serveStaticFile(req, res, pathname) {
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    // Path Traversal Protection:
    // Strip leading drive letters or root slashes
    const normalized = path.normalize(pathname).replace(/^([a-zA-Z]:|[\\/])+/, '');
    
    // Disallow access to hidden files and directories (e.g. .git, .env)
    const segments = normalized.split(/[/\\]/);
    if (segments.some(seg => seg.startsWith('.') && seg !== '.' && seg !== '..')) {
        setSecurityAndCorsHeaders(res);
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden: Access Denied');
        return;
    }

    const targetPath = path.resolve(ROOT_DIR, normalized);
    const rootLower = ROOT_DIR.toLowerCase();
    const targetLower = targetPath.toLowerCase();

    // Verify strictly that the target is inside ROOT_DIR
    if (targetLower !== rootLower && !targetLower.startsWith(rootLower + path.sep)) {
        setSecurityAndCorsHeaders(res);
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden: Access Denied');
        return;
    }

    let resolvedPath = null;

    try {
        // 1. Direct file or directory index check
        if (fs.existsSync(targetPath)) {
            const stat = fs.statSync(targetPath);
            if (stat.isFile()) {
                resolvedPath = targetPath;
            } else if (stat.isDirectory()) {
                const indexPath = path.join(targetPath, 'index.html');
                if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
                    resolvedPath = indexPath;
                }
            }
        }

        // 2. Clean URL check (e.g. /about -> /about.html, /tin-cans -> /tin-cans.html)
        if (!resolvedPath && !path.extname(targetPath)) {
            const htmlPath = targetPath + '.html';
            if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
                resolvedPath = htmlPath;
            }
        }
    } catch (fsErr) {
        resolvedPath = null;
    }

    // 3. 404 Not Found Handling
    if (!resolvedPath) {
        const notFoundPath = path.join(ROOT_DIR, 'error.html');
        setSecurityAndCorsHeaders(res);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });

        if (req.method === 'HEAD') {
            res.end();
            return;
        }

        if (fs.existsSync(notFoundPath)) {
            const stream = fs.createReadStream(notFoundPath);
            stream.on('error', () => {
                if (!res.writableEnded) res.end('404 Not Found');
            });
            req.on('close', () => {
                if (!stream.destroyed) stream.destroy();
            });
            stream.pipe(res);
        } else {
            res.end('404 Not Found');
        }
        return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    setSecurityAndCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': contentType });

    if (req.method === 'HEAD') {
        res.end();
        return;
    }

    const readStream = fs.createReadStream(resolvedPath);
    readStream.on('error', (err) => {
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
        } else if (!res.writableEnded) {
            res.end();
        }
    });

    // Clean up stream if client closes connection early (scanner aborts)
    req.on('close', () => {
        if (!readStream.destroyed) {
            readStream.destroy();
        }
    });

    readStream.pipe(res);
}

const server = http.createServer((req, res) => {
    try {
        // Guard against socket and stream errors (ignore normal client aborts during scans)
        req.on('error', (err) => {
            if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.message === 'aborted' || err.code === 'ECANCELED') return;
            console.warn('[Request Socket Error]:', err.message);
        });
        res.on('error', (err) => {
            if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.message === 'aborted' || err.code === 'ECANCELED') return;
            console.warn('[Response Socket Error]:', err.message);
        });

        // Parse Host & URL safely (Burp Suite sends fuzzed Host headers and raw URLs)
        const rawHost = (req.headers && req.headers.host) ? String(req.headers.host) : `localhost:${DEFAULT_PORT}`;
        const sanitizedHost = rawHost.replace(/[^a-zA-Z0-9.:_-]/g, '') || `localhost:${DEFAULT_PORT}`;

        let parsedUrl;
        try {
            parsedUrl = new URL(req.url || '/', `http://${sanitizedHost}`);
        } catch (urlErr) {
            try {
                const rawUrlPath = (req.url || '/').split('?')[0];
                parsedUrl = { pathname: rawUrlPath, search: '' };
            } catch (fallbackErr) {
                setSecurityAndCorsHeaders(res);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('400 Bad Request: Malformed URL');
                return;
            }
        }

        const decodedPath = safeDecodePathname(parsedUrl.pathname);
        if (decodedPath === null) {
            setSecurityAndCorsHeaders(res);
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('400 Bad Request: Invalid URL encoding');
            return;
        }

        if (req.method === 'OPTIONS') {
            setSecurityAndCorsHeaders(res);
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.method === 'POST' && decodedPath === '/api/investor-query') {
            handleInvestorQuery(req, res);
            return;
        }

        if (req.method === 'GET' || req.method === 'HEAD') {
            serveStaticFile(req, res, decodedPath);
            return;
        }

        setSecurityAndCorsHeaders(res);
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
    } catch (unhandledErr) {
        console.error('[Unhandled Request Error]:', unhandledErr);
        try {
            if (!res.headersSent) {
                setSecurityAndCorsHeaders(res);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            } else if (!res.writableEnded) {
                res.end();
            }
        } catch (e) {
            // Client socket already closed
        }
    }
});

// Handle HTTP client parser errors gracefully (prevents crashes from invalid HTTP packets during Burp scan)
server.on('clientError', (err, socket) => {
    if (err.code === 'ECONNRESET' || !socket.writable) {
        return;
    }
    try {
        socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Type: text/plain\r\n\r\n400 Bad Request\r\n');
    } catch (e) {
        socket.destroy();
    }
});

// Prevent Node.js process from exiting on uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('[Process Uncaught Exception]:', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('[Process Unhandled Rejection]:', reason);
});

function startServer(port) {
    server.listen(port, '0.0.0.0', () => {
        const networkIp = getNetworkIp();
        console.log(`\n=================================================`);
        console.log(`  BKM Industries Limited - Dev Server`);
        console.log(`=================================================`);
        console.log(`  ➜  Local:   http://localhost:${port}/`);
        if (networkIp) {
            console.log(`  ➜  Network: http://${networkIp}:${port}/`);
        }
        console.log(`=================================================\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (port === DEFAULT_PORT && DEFAULT_PORT !== FALLBACK_PORT) {
                console.warn(`Port ${port} is in use, attempting fallback to port ${FALLBACK_PORT}...`);
                startServer(FALLBACK_PORT);
            } else {
                console.error(`Port ${port} is already in use. Please free the port or set PORT environment variable.`);
            }
        }
    });
}

startServer(DEFAULT_PORT);
