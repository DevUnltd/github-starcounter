const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
const repo = urlParams.get('repo');
const showButton = urlParams.get('button');
const showStargazers = urlParams.get('stargazers');

const Starcounter = window.Starcounter.default;
const StarcounterInstance = new Starcounter({
    user, repo, showButton, showStargazers
});

console.log("StarcounterInstance", StarcounterInstance);