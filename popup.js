// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This is a modified extension from a Chromium sample.
// Extension downloads all .fit files from a page

// Links to .fit files are saved here.
// When we click download files are there from
// here.
var foundLinks = [];

// Display all visible links.
function showLinks(visibleLinks) {
  console.log('popup:showLinks');
  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }
  for (var i = 0; i < visibleLinks.length; ++i) {
    var row = document.createElement('tr');
    var col0 = document.createElement('td');
    var col1 = document.createElement('td');
    col1.innerText = visibleLinks[i];
    col1.style.whiteSpace = 'nowrap';
    row.appendChild(col1);
    linksTable.appendChild(row);
  }
}

// Download all links.
function downloadCheckedLinks() {
  console.log('popup:downloadCheckedLinks');
  var visibleLinks = foundLinks;
  console.log('popup:downloadCheckedLinks:visibleLinks.length', visibleLinks.length);
  for (var i = 0; i < visibleLinks.length; ++i) {
      console.log(visibleLinks[i]);
      chrome.downloads.download(
        {
            url: visibleLinks[i]
        },
        function(id) {
          console.log('popup:downloadCheckedLinks:download', id);
        }
      );
  }
  // If we close the window then files are not saved
  //window.close();
}

// Process links, sort, remove duplicates and show them.  
function process_links(links) {
  console.log('popup:process_links:links.length', links.length);
  var allLinks = [];
  for (var index in links) {
    // Check if .fit link is part or url parameter
    console.log('popup:process_links: link ' + links[index]);
    var parts = links[index].split("?");
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf('.fit') != -1) {
        console.log('popup:process_links: keep link part ' + parts[i]);
        if (parts[i].indexOf('url=') != -1) {
          parts[i] = parts[i].substr(4);
        }
        allLinks.push(parts[i]);
      } else {
        console.log('popup:process_links: skip link part ' + parts[i]);
      }
    }
  }

  console.log('popup:sort:allLinks.length', allLinks.length);
  allLinks.sort();

  // remove duplicates
  console.log('popup:remove duplicates');
  var finalLinks = [];
  if (allLinks.length > 0) {
    finalLinks.push(allLinks[0]);
    for (var i = 1; i < allLinks.length; i++) {
      if (allLinks[i-1] != allLinks[i]) {
        finalLinks.push(allLinks[i]);
      }
    }
  }
  
  console.log('popup:done:finalLinks.length', finalLinks.length);
  
  showLinks(finalLinks);
  
  return finalLinks;
}

// Set up event handlers and inject send_links.js into all frames in the active
// tab.
window.onload = function() 
{
    document.getElementById('download0').onclick = downloadCheckedLinks;

    chrome.windows.getCurrent(function (currentWindow) {
          chrome.tabs.query(
              {
                  active: true, 
                  windowId: currentWindow.id
              },
              function(activeTabs) {
                console.log('popup:executeScript');
                chrome.tabs.executeScript(
                      activeTabs[0].id, 
                      {
                          file: 'send_links.js', 
                          allFrames: true
                      },
                      function (results) {
                          // Process results. There may be multiple frames
                          // but for now we assume that only one of them has
                          // .fit files.
                          for (var i = 0; i < results.length; i++) {
                              console.log('popup:executeScript:results', i, results[i]);
                              if (results[i].length > 0) {
                                console.log('popup:executeScript:foundLinks set');
                                foundLinks = process_links(results[i]);
                              }
                          }
                      }
                  );
              }
          );
    });
};
