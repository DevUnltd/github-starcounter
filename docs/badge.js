const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
const repo = urlParams.get('repo');
const showButton = urlParams.get('button');
const showStargazers = urlParams.get('stargazers');
const showButtonCount = urlParams.get('buttoncount');
const theme = urlParams.get('theme');
const nbItems = urlParams.get('nbitems');

const Starcounter = window.Starcounter.default;
new Starcounter({
    user, repo, showButton, showStargazers, theme, showButtonCount, nbItems
});