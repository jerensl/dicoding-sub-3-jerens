const idxDB = (() => {
  const dbPromised = idb.open("red-devils", 1, (upgradeDB) => {
    if (!upgradeDB.objectStoreNames.contains("favorite")) {
      upgradeDB.createObjectStore("favorite");
    }
  });

  function checkFavClub() {
    const data = dbPromised
      .then((db) => {
        const tx = db.transaction("favorite", "readonly");
        const store = tx.objectStore("favorite");
        return store.getAll();
      })
      .then((item) => item);
    return data;
  }

  async function checkFavClubByID(id) {
    const data = dbPromised
      .then((db) => {
        const tx = db.transaction("favorite", "readonly");
        const store = tx.objectStore("favorite");
        return store.get(id);
      })
      .then((items) => {
        return items;
      });

    return data;
  }

  function addFavClub({ id, name, crestUrl, venue }) {
    dbPromised
      .then((db) => {
        const tx = db.transaction("favorite", "readwrite");
        const store = tx.objectStore("favorite");

        const item = {
          id,
          name,
          crestUrl,
          venue,
        };

        store.put(item, id);

        return tx.complete;
      })
      .then(() => {
        console.log("Favorite Club added");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function deleteFavClub(clubID) {
    dbPromised.then((db) => {
      const tx = db.transaction("favorite", "readwrite");
      const store = tx.objectStore("favorite");

      store.delete(clubID);
      render.showFavorite();
      return tx.complete;
    });
  }

  return { checkFavClub, checkFavClubByID, addFavClub, deleteFavClub };
})();
