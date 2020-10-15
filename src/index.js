import "./index.css";

class Starcounter {
  constructor({ showBtn, showStargazers, showButtonCount, user, repo, theme }) {
    this.user = user;
    this.repo = repo;
    this.showBtn = showBtn === "false" ? false : true;
    this.showStargazers = showStargazers === "true";
    this.showButtonCount = showButtonCount === "true";
    this.theme = theme;
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
        })
        .catch((reason) => console.log(reason));
    });
  };

  render = async () => {
    if (this.theme) {
      this.wrapperElem.classList.add("du-theme-" + this.theme);
    }

    if (this.showStargazers || this.showButtonCount) {
      const { stargazers_count } = await this.getApi();
      this.stargazers_count = stargazers_count;
    }

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
    buttonElem.setAttribute(
      "href",
      this.stargazers_count ? this.stargazersUrl : this.repoUrl
    );
    buttonElem.setAttribute("target", "_blank");

    if (this.showButtonCount && this.stargazers_count) {
      buttonElem.classList.add("show-count");
      buttonElem.innerHTML = `
        <span class="du-star-span">Star</span>
        <span class="du-count-span">${this.stargazers_count.toLocaleString(
          "en-US"
        )}</span>
      `;
    } else {
      buttonElem.innerHTML = "Star";
    }

    this.wrapperElem.appendChild(buttonElem);
  };

  renderStargazers = async () => {
    if (this.stargazers_count < 5) return;

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
      const { /*html_url, */ avatar_url, login } = stargazer;
      const avatarElem = document.createElement("a");
      avatarElem.className = "du-stargazer";
      avatarElem.style.backgroundImage = `url('${avatar_url}')`;
      avatarElem.setAttribute("target", "_blank");
      avatarElem.setAttribute("href", this.stargazersUrl);
      avatarElem.setAttribute("title", `${login} supports ${this.repo}`);
      avatarContainerElem.appendChild(avatarElem);
    });

    stargazersElem.appendChild(avatarContainerElem);

    const stargazersTextElem = document.createElement("div");
    stargazersTextElem.className = "du-stargazers-text";

    if (this.theme === "inline") {
      stargazersTextElem.innerHTML = `
        +${(this.stargazers_count - 3).toLocaleString("en-US")}
      `;
    } else {
      stargazersTextElem.innerHTML = `
        <a href="${
          lastStargazer.html_url
        }" target="_blank" class="du-user-showcase">${
        lastStargazer.login
      }</a> and ${(this.stargazers_count - 1).toLocaleString(
        "en-US"
      )} others have starred <a href="${this.stargazersUrl}" target="_blank">${
        this.repo
      }</a>.
      `;
    }

    stargazersElem.appendChild(stargazersTextElem);
    this.wrapperElem.appendChild(stargazersElem);
  };
}

export default Starcounter;
