const BASE_URL = "https://api.football-data.org/v2/";

const API_KEY_FOOTBALL = "57f4d7173b344e88a523307718277655";
const EPL = 2021;

const component = (() => {
  const mounting = (elm) => ({
    loading: () => {
      document.getElementById(elm).innerHTML = `
      <div class="preloader-wrapper active loader">
      <div class="spinner-layer spinner-red-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>`;
    },
    error: () => {
      document.getElementById(elm).innerHTML = `
      <div class="center">
      <h6>
      Sorry Something Wrong....
      </h6>
    </div>`;
    },
    render: (html) => {
      document.getElementById(elm).innerHTML = html;
    },
  });

  async function getNews() {
    const fav = await idxDB.checkFavClub();
    let favoriteTeam = fav[0]?.name ?? "Manchester United";

    const API_KEY_NEWS = "d2f43a96d36343879ff924909fd2f254";
    const ENDPOINT_NEWS = `https://newsapi.org/v2/everything?q=${favoriteTeam}&language=id&apiKey=${API_KEY_NEWS}`;

    const elementID = "news-football";

    await mounting(elementID).loading();
    utils
      .fetchAPI(ENDPOINT_NEWS, { mode: "cors" })
      .then((data) => {
        const news = render.showNews(data);
        mounting(elementID).render(news);
      })
      .catch(() => mounting(elementID).error());
  }

  function getCompetition() {
    const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${EPL}/standings`;

    utils
      .fetchAPI(ENDPOINT_COMPETITION, {
        headers: { "X-Auth-Token": API_KEY_FOOTBALL },
      })

      .then((data) => {
        let standings = render.showStanding(data);
        mounting("klasemen").render(standings);
      })
      .catch((error) => console.log("Err getCompetition:", error));
  }

  async function getClub() {
    const urlParams = new URLSearchParams(window.location.search);
    const CLUB_ID = urlParams.get("id");
    const ENDPOINT_CLUB = `${BASE_URL}teams/${CLUB_ID}`;
    const ENDPOINT_MATCH = `${BASE_URL}teams/${CLUB_ID}/matches?status=`;

    const addZero = (n) => {
      return n < 10 ? "0" + n : n;
    };

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const dateNow = year + "-" + addZero(month) + "-" + addZero(day);

    const beforeWeek = new Date();
    beforeWeek.setDate(beforeWeek.getDate());
    const nDay = beforeWeek.getDate();
    const nMonth = beforeWeek.getMonth();
    const nYear = beforeWeek.getFullYear();
    const dateBefore = nYear + "-" + addZero(nMonth) + "-" + addZero(nDay);

    let clubInfo = {};

    const getDate = () => ({});

    await utils
      .fetchAPI(ENDPOINT_CLUB, {
        headers: { "X-Auth-Token": API_KEY_FOOTBALL },
      })
      .then(async (data) => {
        clubInfo = data;
        render.showClub(data);
        render.showSquad(data);
      })
      .catch((error) => console.log(error));

    utils
      .fetchAPI(ENDPOINT_MATCH + "SCHEDULED", {
        headers: { "X-Auth-Token": API_KEY_FOOTBALL },
      })
      .then((data) => {
        render.showMatches(data);
      });

    utils
      .fetchAPI(
        ENDPOINT_MATCH +
          "FINISHED" +
          `&dateFrom=${dateBefore}&dateTo=${dateNow}` +
          "&limit=10",
        {
          headers: { "X-Auth-Token": API_KEY_FOOTBALL },
        }
      )
      .then((data) => {
        render.showResults(data);
      });

    return clubInfo;
  }

  function getTopScore() {
    const ENDPOINT_TOPSCORE = `${BASE_URL}competitions/${EPL}/scorers?limit=3`;

    utils
      .fetchAPI(ENDPOINT_TOPSCORE, {
        headers: { "X-Auth-Token": API_KEY_FOOTBALL },
      })
      .then((data) => {
        render.showTopScore(data);
      });
  }

  function getMatch() {
    const addZero = (n) => {
      return n < 10 ? "0" + n : n;
    };

    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let dateNow = year + "-" + addZero(month) + "-" + addZero(day);

    let nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    let nDay = nextWeek.getDate();
    let nMonth = nextWeek.getMonth() + 1;
    let nYear = nextWeek.getFullYear();
    let dateTo = nYear + "-" + addZero(nMonth) + "-" + addZero(nDay);

    const ENDPOINT_MATCHES = `${BASE_URL}competitions/${EPL}/matches?dateFrom=${dateNow}&dateTo=${dateTo}&status=SCHEDULED`;

    utils
      .fetchAPI(ENDPOINT_MATCHES, {
        headers: { "X-Auth-Token": API_KEY_FOOTBALL },
      })
      .then((data) => {
        render.showMatch(data);
      });
  }

  return { getTopScore, getCompetition, getMatch, getNews, getClub };
})();
