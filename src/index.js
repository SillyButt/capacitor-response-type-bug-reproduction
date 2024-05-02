window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
            button.valid { border-color: green; }
            button.invalid { border-color: darkred; }
        </style>
        
        <div>
            The bug is in XMLHttpRequest/fetch patch that doesn't pass the 'responseType' parameter to platform's native Http.<br/>
            This leads to a bug where response is not parsed to the expected type of the response.<br/>
            <b>Open console.</b>
        </div>
        
        <button id="request-original" class="valid">Download PDF (<b>Original</b> implementation with responseType: 'blob')</button><br/>
        <button id="request-patched" class="invalid">Download PDF (<b>Patched</b> implementation with responseType: 'blob')</button>
      `;
    }

    connectedCallback() {
      const [host, port] = ['192.168.100.6', 8000];
      const self = this;

      async function requestDocument() {
        try {
          console.log('XMLHttpRequest with "responseType: blob"');

          const req = new XMLHttpRequest();

          function responseCallback() {
            const raw = req.response;
            console.log('Patched XMLHttpRequest response:', raw);
          }

          req.addEventListener("load", responseCallback);
          req.responseType = 'blob';
          req.open("GET", `http://${host}:${port}/get-document`);
          req.send();
        } catch (error) {
          console.error('ERROR:', error);
        }
      }

      async function requestDocumentOriginal() {
        const originalXMLHttpRequest = window.CapacitorWebXMLHttpRequest.constructor;

        const req = new originalXMLHttpRequest();

        function responseCallback() {
          const raw = req.response;
          console.log('Original XMLHttpRequest response:', raw);
        }

        req.addEventListener("load", responseCallback);
        req.responseType = 'blob';
        req.open("GET", `http://${host}:${port}/get-document`);
        req.setRequestHeader('content-type', 'application/pdf');
        req.send();
      }

      self.shadowRoot.querySelector('#request-original').addEventListener('click', requestDocumentOriginal);
      self.shadowRoot.querySelector('#request-patched').addEventListener('click', requestDocument);
    }
  }
);
