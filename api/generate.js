export default function handler(req, res) {
  // Link de tu app (Firebase Dynamic Link o esquema personalizado)
  const appDeepLink = 'myapp://'; // cambia a tu esquema real
  const playStoreLink = 'https://play.google.com/store/apps/details?id=com.jesse.live_music';
  const appStoreLink = 'https://apps.apple.com/mx/app/my-events/id6747364802';
  const fallbackWeb = 'https://myevents.com';

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Abriendo app...</title>
      <script>
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Intentar abrir la app
        window.location = "${appDeepLink}";

        // Si no funciona, después de 1s mandar a la tienda
        setTimeout(function() {
          if (/android/i.test(userAgent)) {
            window.location.href = "${playStoreLink}";
          } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            window.location.href = "${appStoreLink}";
          } else {
            window.location.href = "${fallbackWeb}";
          }
        }, 1000);
      </script>
    </head>
    <body>
      <p>Abriendo tu app...</p>
    </body>
    </html>
  `);
}
