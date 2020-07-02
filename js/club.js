if ("serviceWorker" in navigator) {
  registerServiceWorker();
} else {
  console.log("ServiceWorker not supported yet in this browser!");
}

function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/dicoding-sub-3-jerens/sw.js", , {scope: '/dicoding-sub-3-jerens/'})
    .then(function (registration) {
      console.log("Service worker registered successfully!");
      return registration;
    })
    .catch(function (err) {
      console.error("Service worker registeration failed!", err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.querySelector(".fixed-action-btn");
  const instances = M.FloatingActionButton.init(saveButton, {});

  component.getClub();

  saveButton.onclick = () => {
    component.getClub().then(async (data) => {
      const clubFound = await idxDB.checkFavClubByID(data.id);

      if (!clubFound) {
        idxDB.addFavClub(data);
        M.toast({ html: "add Favorite Club" });
        document.getElementById("save-icons").innerHTML = "delete";
      } else {
        idxDB.deleteFavClub(data.id);
        M.toast({ html: "delete Favorite Club" });
        document.getElementById("save-icons").innerHTML = "save";
      }
    });
  };

  const elems = document.querySelector(".tabs");
  const instance = M.Tabs.init(elems, { swipeable: true });
});
