
function injectCSS() {

  const key = `ngcCSSInject__${window.location.hostname}`;

  chrome.storage.sync.get([key], function(result) {

    const css = result[key];

    if (css) {

      const elementStyle = document.createElement('style');

      elementStyle.setAttribute('id', 'ngc-css-inject');
      elementStyle.innerHTML = css;

      document.head.appendChild(elementStyle);
    }
  });
}

function removeExistingCSS() {

  const element = document.getElementById('ngc-css-inject');

  if (element) {

    element.parentNode.removeChild(element);
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.setCSS === true) {

    removeExistingCSS();
    injectCSS();

  } else if (request.setCSS === false) {

    removeExistingCSS();
  }

  sendResponse({success: true});
});

removeExistingCSS();
injectCSS();
