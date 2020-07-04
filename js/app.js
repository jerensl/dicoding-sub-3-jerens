if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    registerServiceWorker();
    requestPermission();
  });
} else {
  console.log("ServiceWorker not supported yet in this browser!");
}

function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/dicoding-sub-3-jerens/sw.js", {scope: '/dicoding-sub-3-jerens/'})
    .then(function (registration) {
      console.log("Service worker registered successfully!");
      return registration;
    })
    .catch(function (err) {
      console.error("Service worker registeration failed!", err);
    });
}

function requestPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }

      navigator.serviceWorker.ready.then(() => {
        if ("PushManager" in window) {
          navigator.serviceWorker
            .getRegistration()
            .then(function (registration) {
              registration.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: utils.urlBase64ToUint8Array(
                    "BCWY0GrN8YqGSr6QXAnP_Z7Zt-TlSAKnH4o0nYfLHGlNPTl85lb8qrmHDAFvNUFFxBYgTGNA4lYiw7vUGIu7ImI"
                  ),
                })
                .then((subscribe) => {
                  console.table({
                    endpoit: subscribe.endpoint,
                    pd256key: btoa(
                      String.fromCharCode.apply(
                        null,
                        new Uint8Array(subscribe.getKey("p256dh"))
                      )
                    ),
                    authKey: btoa(
                      String.fromCharCode.apply(
                        null,
                        new Uint8Array(subscribe.getKey("auth"))
                      )
                    ),
                  });
                })
                .catch(function (e) {
                  console.error("Tidak dapat melakukan subscribe ", e.message);
                });
            });
        }
      });
    });
  }
}
