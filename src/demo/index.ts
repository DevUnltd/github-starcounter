import Starcounter from "../lib";

const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get("user");
const repo = urlParams.get("repo");
const showBtn = urlParams.get("button");
const showStargazers = urlParams.get("stargazers");
const showButtonCount = urlParams.get("buttoncount");
const theme = urlParams.get("theme");
const nbItems = parseFloat(urlParams.get("nbitems"));
const goalStep = parseFloat(urlParams.get("goalstep"));
const goalDiff = urlParams.get("goaldiff");

new Starcounter({
  user,
  repo,
  showBtn,
  showStargazers,
  theme,
  showButtonCount,
  nbItems,
  goalStep,
  goalDiff,
});
