
const state = {
  key: null,
};

function init() {

  const buttonReset = document.getElementById('reset');
  const form = document.getElementById('form');
  const textarea = document.getElementById('input-css');

  buttonReset.addEventListener('click', removeAllCustomCSS);

  form.addEventListener('submit', (e) => {

    e.preventDefault();

    const css = textarea.value;

    storeCSS(css);
  });

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

    const tab = tabs[0];
    const url = new URL(tab.url);
    const key = `ngcCSSInject__${url.hostname}`;

    state.key = key;

    chrome.storage.sync.get([key], function(result) {

      const css = result[key];

      if (css) {

        textarea.value = css;
      }
    });
  });
}

function removeAllCustomCSS() {

  chrome.storage.sync.remove([state.key], function() {

    const textarea = document.getElementById('input-css');

    textarea.value = '';

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

      chrome.tabs.sendMessage(tabs[0].id, {setCSS: false}, (response) => {

        window.close();
      });
    });
  });
}

function storeCSS(css) {

  const value = {
    [state.key]: css
  };

  chrome.storage.sync.set(value, function() {

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

      chrome.tabs.sendMessage(tabs[0].id, {setCSS: true}, (response) => {

        window.close();
      });
    });
  });
}

(function () {
  window.addEventListener('DOMContentLoaded', init);
})();
