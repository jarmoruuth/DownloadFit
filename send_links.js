// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This is a modified extension from a Chromium sample.
// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

(function () {

  var links = [].slice.apply(document.getElementsByTagName('a'));
  links = links.map(function(element) {
    // Return an anchor's href attribute, stripping any URL fragment (hash '#').
    // If the html specifies a relative path, chrome converts it to an absolute
    // URL.
    var href = element.href;
    var hashIndex = href.indexOf('#');
    if (hashIndex >= 0) {
      href = href.substr(0, hashIndex);
    }
    return href;
  });

  links.sort();

  // Remove duplicates and invalid URLs.
  var kBadPrefix = 'javascript';
  var finalLinks = [];
  for (var i = 0; i < links.length; i++) {
    if (((i > 0) && (links[i].trim() == links[i - 1].trim())) ||
        (links[i] == '') ||
        (kBadPrefix == links[i].toLowerCase().substr(0, kBadPrefix.length)) ||
        links[i].indexOf('.fit') == -1) 
    {
      console.log('send_links:skip link ' + i + ' ' + links[i]);
    } else {
      console.log('send_links:keep link ' + i + ' ' + links[i]);
      finalLinks.push(links[i]);
    }
  }
  return finalLinks;

})();
