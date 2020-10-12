const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
const repo = urlParams.get('repo');
const showButton = urlParams.get('button');
const showStargazers = urlParams.get('stargazers');
const theme = urlParams.get('theme');

const Starcounter = window.Starcounter.default;
new Starcounter({
    user, repo, showButton, showStargazers, theme
});