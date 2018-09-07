# DownloadFit

Chrome extension to download all .fit files from a page. When extension is executed it lists all found .fit files. If files are accepted then all files are downloaded to a local disk. You need to click save for each file.

Currently the extension must be run on a Chrome extension developer mode.

Steps to use this extension:

1. Open Chrome extensions page chrome://extensions/
2. Enable Developer mode
3. Click Load unpacked and open folder where extension files are.
4. Extension icon "D" should be visible on the top right corner
5. Go to a page with .fit files
6. Click extension icon "D"
7. Click "Download All .fit Files"
8. Click Save for each file

This code is just a modified version of Chrome sample than can be found at:
https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/downloads/download_links/
