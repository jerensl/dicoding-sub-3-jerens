const render = (() => {
  function showNews(data) {
    let newsHTML = "";

    data.articles.forEach((news) => {
      newsHTML += `
      <div class="col s12 m7">
      <div class="card ">
        <div class="card-image">
          <img class="news-img" src="${news.urlToImage.replace(
            /^http:\/\//i,
            "https://"
          )}">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <p>${news.description}</p>
          </div>
          <div class="card-action">
            <a href="${news.url}">Read More</a>
          </div>
        </div>
      </div>
    </div>
      `;
    });
    return newsHTML;
  }

  function showStanding(data) {
    let standings = "";

    document.getElementById("league-title").innerHTML = `
      <h5>
      <b>${data.competition.name}</b>
      </h5>
      `;

    data.standings[0].table.forEach((standing) => {
      standings += `
                <tr rel="preconnect" onclick="location.href='./club.html?id=${
                  standing.team.id
                }'">
                    <td class="center">${standing.position}</td>
                    <td>
                    <img crossorigin="anonymous" class="emblem" alt="${
                      standing.team.name
                    }" 
                      src="${standing.team.crestUrl.replace(
                        /^http:\/\//i,
                        "https://"
                      )}" alt="badge"/>
                      <span>${standing.team.name}</span>
                    </td>
                    <td>${standing.playedGames}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td class="center">${standing.points}</td>
                </tr>
        `;
    });

    const html = `<table class="striped">
    <thead>
      <tr>
        <th class="center">Pos</th>
        <th>Club</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th class="center">PTS</th>
      </tr>
    </thead>
    <tbody id="standings">${standings}</tbody>
  </table>`;

    return html;
  }

  function showTopScore(players) {
    let playersHTML = "";

    players.scorers.forEach((player) => {
      playersHTML += `
      <tr>
          <td>${player.player.name}</td>
          <td>${player.team.name}</td>
          <td class="center">${player.numberOfGoals}</td>
      </tr>
      `;
    });

    document.getElementById("topscore").innerHTML = playersHTML;
  }

  function showMatch(data) {
    let matches = "";
    let count = 1;

    data.matches.forEach((match) => {
      matches += `
      <h6><b>Matchday ${count++} </b></h6>
      <div class="card match-card row center-align">
      
      <div class="col s4">
      <p>Home</p>
      <p><b>${match.homeTeam.name}</b></p>
      </div>
      
      <div class="col s4 match-time">
      <h6><b>VS</b></h6>
      <p>${match.utcDate.slice(0, 10)}</p>
      <p>${match.utcDate.slice(11, 16)} UTC</p>
      </div>
  
      <div class="col s4">
        <p>Away</p>
        <p><b>${match.awayTeam.name}</b></p>
      </div>
  
       </div>
      `;
    });

    document.getElementById("match").innerHTML = matches;
  }

  async function showClub(clubData) {
    let coach = "";

    clubData.squad
      .filter((person) => {
        return person.role === "COACH";
      })
      .map((player) => {
        coach += `
          <b>${player.name}</b>
  `;
      });

    document.getElementById("club").innerHTML = `
    <div class="main-wrapper container">

      <div class="row club">
        <h4 class="col s12 m8 center-align" id="club-name"><b>${
          clubData.name
        }</b></h4>
        <div class="col s12 m4">
        <img src="${clubData.crestUrl.replace(/^http:\/\//i, "https://")}">
        </div>
      </div>
      <div class="card club-card row z-depth-0">
  
          <div class="col s12">
            <p><b>${clubData.venue}</b></p>
            <p><b>${clubData.address}</b></p>
          </div>
  
          <div class="col s6">
            <p>Fax</p>
            <p><b>${clubData?.phone ?? "-"}</b></p>
          </div>

          <div class="col s6">
            <p>Coach</p>
            <p>${coach}</p>
          </div>

          <div class="col s6">
            <p>Website</p>
            <a href="${clubData?.website}" target="_blank">
              <b>
                ${clubData?.website ?? "-"}
              </b>
            </a>
          </div>
  
          <div class="col s6">
            <p>Club Enquiries</p>
            <p><b>${clubData?.email ?? "-"}</b></p>
          </div>
  
       </div>
    </div>
    `;

    const favButton = await idxDB.checkFavClubByID(clubData.id);

    if (!favButton) {
      document.getElementById("save-icons").innerHTML = "save";
    } else {
      document.getElementById("save-icons").innerHTML = "delete";
    }
  }

  function showMatches(data) {
    let match = "";

    data.matches.forEach((matches) => {
      match += `
      <div class="col s12">
        <h6><b>${matches.competition.name}</b></h6>
      </div>
      <div class="col s5">
        <h6><b>${matches.homeTeam.name}</b></h6>
      </div>
      <div class="col s2 matches-time">
        <p>${matches.utcDate.slice(11, 16)}</p>
      </div>
      <div class="col s5">
        <h6><b>${matches.awayTeam.name}</b></h6>
     </div>
     <div class="col s12">
     <p> ${matches.utcDate.slice(0, 10)}</p>
   </div>
     <div class="col s12 divider"></div>
      `;
    });

    document.getElementById("matches").innerHTML = match;
  }

  const showSquad = (data) => {
    let players = "";

    data.squad
      .filter((player) => {
        return player.role.indexOf("PLAYER") > -1;
      })
      .map((player) => {
        players += `
    <tr>
        <td>${player?.shirtNumber ?? "-"}</td>
        <td>${player.name}</td>
        <td>${player.nationality}</td>
        <td>${player.position}</td>
    </tr>
  `;
      });

    document.getElementById("players").innerHTML = players;
  };

  function showResults(data) {
    let results = "";

    data.matches.forEach((matches) => {
      results += `
      <div class="col s12">
        <h6><b>${matches.competition.name}</b></h6>
      </div>
      <div class="col s5">
        <h6><b>${matches.homeTeam.name}</b></h6>
      </div>
      <div class="col s2 matches-time">
        <p><b>${matches.score.fullTime.homeTeam} VS ${
        matches.score.fullTime.awayTeam
      }</b></p>
      </div>
      <div class="col s5">
        <h6><b>${matches.awayTeam.name}</b></h6>
     </div>
     <div class="col s12">
        <p> ${matches.utcDate.slice(0, 10)}</p>
     </div>
     <div class="col s12 divider"></div>
      
      `;
    });

    document.getElementById("results").innerHTML = results;
  }

  async function showFavorite() {
    let favorite = "";

    const favoriteData = await idxDB.checkFavClub();

    if (!favoriteData[0]) {
      favorite += `
        <h6 class="center">
        You dont have Favorite Team
        </h6>
      `;

      document.getElementById("favorite-club").innerHTML = favorite;
    }

    favoriteData.forEach((club) => {
      favorite += `
        <div class="card club-card row center-align z-depth-0">
        <div class="col s12">
        <img class="fav-img" src="${club.crestUrl.replace(
          /^http:\/\//i,
          "https://"
        )}">
        </div>
  
        <div class="col s6">
        <p>Club</p>
        <p><b>${club.name}</b></p>
        </div>
    
        <div class="col s6">
          <p>Stadion</p>
          <p><b>${club.venue}</b></p>
        </div>
    
        <button onClick="idxDB.deleteFavClub(${
          club.id
        })" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></button>
     </div>
        `;
    });

    document.getElementById("favorite-club").innerHTML = favorite;
  }

  return {
    showNews,
    showStanding,
    showTopScore,
    showMatch,
    showClub,
    showSquad,
    showMatches,
    showResults,
    showFavorite,
  };
})();
