function buildManifestPlist(origin) {
  const ipaUrl = `${origin}/APK/iOS_MDM_v8.1.ipa`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>items</key>
    <array>
      <dict>
        <key>assets</key>
        <array>
          <dict>
            <key>kind</key>
            <string>software-package</string>
            <key>url</key>
            <string>${ipaUrl}</string>
          </dict>
        </array>
        <key>metadata</key>
        <dict>
          <key>bundle-identifier</key>
          <string>MND.NCSIST.MDM.iOS</string>
          <key>bundle-version</key>
          <string>8.1</string>
          <key>kind</key>
          <string>software</string>
          <key>platform-identifier</key>
          <string>com.apple.platform.iphoneos</string>
          <key>title</key>
          <string>iOS_MDM</string>
        </dict>
      </dict>
    </array>
  </dict>
</plist>
`;
}

function withAssetHeaders(response, pathname) {
  if (!response) {
    return response;
  }

  const headers = new Headers(response.headers);
  const lowerPath = pathname.toLowerCase();

  if (lowerPath.endsWith('.apk')) {
    headers.set('Content-Type', 'application/vnd.android.package-archive');
    headers.set('Content-Disposition', 'attachment');
  }

  if (lowerPath.endsWith('.ipa')) {
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment');
  }

  if (lowerPath.endsWith('.plist')) {
    headers.set('Content-Type', 'application/x-plist');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/manifest.plist') {
      return new Response(buildManifestPlist(url.origin), {
        headers: {
          'Content-Type': 'application/x-plist',
          'Cache-Control': 'no-store'
        }
      });
    }

    const assetPath = url.pathname === '/' ? '/mdm.html' : url.pathname;
    const assetRequest = new Request(new URL(assetPath, url), request);
    const assetResponse = await env.ASSETS.fetch(assetRequest);

    return withAssetHeaders(assetResponse, assetPath);
  }
};