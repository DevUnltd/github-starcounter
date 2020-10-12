import "./index.css";

class Starcounter {
  constructor({ showBtn, showStargazers, user, repo }) {
    this.user = user;
    this.repo = repo;
    this.showBtn = showBtn === "false" ? false : true;
    this.showStargazers = showStargazers === "true";
    this.wrapperElem = document.querySelector(".github-starcounter");
    this.endpoint = `https://api.github.com/repos/${this.user}/${this.repo}`;
    this.stargazersUrl = `https://github.com/${this.user}/${this.repo}/stargazers`;
    this.repoUrl = `https://github.com/${this.user}/${this.repo}`;
    this.render();
  }

  getApi = (path = "") => {
    return new Promise((resolve) => {
      fetch(this.endpoint + path)
        .then((response) => response.json())
        .then((data = {}) => {
          resolve(data);
        });
    });
  };

  render = async () => {
    if (this.showBtn) {
      this.renderButton();
    }

    if (this.showStargazers) {
      this.renderStargazers();
    }
  };

  renderButton = () => {
    const buttonElem = document.createElement("a");
    buttonElem.className = "du-button";
    buttonElem.innerHTML = "Star";
    buttonElem.setAttribute("href", this.stargazersUrl);
    buttonElem.setAttribute("target", "_blank");
    //buttonElem.innerHTML = this.stargazers_count.toLocaleString("en-US");
    this.wrapperElem.appendChild(buttonElem);
  };

  renderStargazers = async () => {
    const { stargazers_count } = await this.getApi();
    if (!stargazers_count) return;
    this.stargazers_count = stargazers_count;

    if (this.stargazers_count < 2) return;

    const lastPageIdx = Math.ceil(this.stargazers_count / 100);
    if (typeof lastPageIdx === "undefined") return;

    const users = /*this.mockUsers(); */ await this.getApi(
      `/stargazers?page=${lastPageIdx}&per_page=100`
    );
    if (!(Array.isArray(users) && users.length)) return;

    const recentStargazers = users.slice(Math.max(users.length - 3, 1));
    const lastStargazer = recentStargazers[recentStargazers.length - 1];

    const stargazersElem = document.createElement("div");
    stargazersElem.className = "du-stargazers";

    const avatarContainerElem = document.createElement("div");
    avatarContainerElem.className = "du-stargazer-container";

    recentStargazers.forEach((stargazer) => {
      const { html_url, avatar_url, login } = stargazer;
      const avatarElem = document.createElement("a");
      avatarElem.className = "du-stargazer";
      avatarElem.style.backgroundImage = `url('${avatar_url}')`;
      avatarElem.setAttribute("href", html_url);
      avatarElem.setAttribute("target", "_blank");
      avatarElem.setAttribute("title", login);
      avatarContainerElem.appendChild(avatarElem);
    });

    stargazersElem.appendChild(avatarContainerElem);

    const stargazersTextElem = document.createElement("div");
    stargazersTextElem.innerHTML = `
      <a href="${
        lastStargazer.html_url
      }" target="_blank" class="du-user-showcase">${
      lastStargazer.login
    }</a> and ${(this.stargazers_count - 1).toLocaleString(
      "en-US"
    )} others have starred <a href="${this.repoUrl}" target="_blank">${
      this.repo
    }</a>.
    `;

    stargazersElem.appendChild(stargazersTextElem);
    this.wrapperElem.appendChild(stargazersElem);
  };
}

export default Starcounter;
