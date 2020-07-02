const utils = (() => {
  function fetchAPI(endpoint, { ...custom } = { mode: "no-cors" }) {
    const config = {
      ...custom,
      headers: {
        ...custom.headers,
      },
    };

    return fetch(endpoint, config)
      .then((res) => {
        if (res.status === 200) {
          return Promise.resolve(res.json());
        } else {
          return Promise.reject(new Error(res.statusText));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return { fetchAPI, urlBase64ToUint8Array };
})();
