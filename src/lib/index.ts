import "./index.css";

interface StarcounterInterface {
  showBtn: boolean;
  showStargazers: boolean;
  showButtonCount: boolean;
  user: string;
  repo: string;
  theme: string;
  nbItems: number;
  goalStep: number;
}

interface StarcounterParams {
  showBtn: string;
  showStargazers: string;
  showButtonCount: string;
  user: string;
  repo: string;
  theme: string;
  nbItems: number;
  goalStep: number;
}

class Starcounter implements StarcounterInterface {
  showBtn;
  showStargazers;
  showButtonCount;
  user;
  repo;
  theme;
  nbItems;
  wrapperElem;
  mainSection;
  secondarySection;
  endpoint;
  stargazersUrl;
  repoUrl;
  stargazers_count: number;
  goalStep: number;

  constructor({
    showBtn,
    showStargazers,
    showButtonCount,
    user,
    repo,
    theme,
    nbItems = 3,
    goalStep = 0,
  }: Partial<StarcounterParams>) {
    this.user = user;
    this.repo = repo;
    this.showBtn = showBtn === "false" ? false : true;
    this.showStargazers = showStargazers === "true";
    this.showButtonCount = showButtonCount === "true";
    this.theme = theme;
    this.nbItems = nbItems > 0 && nbItems < 50 ? nbItems : 3;
    this.goalStep = goalStep || 0;

    this.endpoint = `https://api.github.com/repos/${this.user}/${this.repo}`;
    this.stargazersUrl = `https://github.com/${this.user}/${this.repo}/stargazers`;
    this.repoUrl = `https://github.com/${this.user}/${this.repo}`;

    this.wrapperElem = document.querySelector(".github-starcounter");

    this.mainSection = document.createElement("div");
    this.mainSection.className = "du-main-section";

    this.secondarySection = document.createElement("div");
    this.secondarySection.className = "du-secondary-section";

    this.wrapperElem.appendChild(this.mainSection);
    this.wrapperElem.appendChild(this.secondarySection);

    this.render();
  }

  getApi = (path = "") => {
    return new Promise((resolve) => {
      fetch(this.endpoint + path)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(
              "Could not reach the Github API. Please try again later"
            );
          }
        })
        .then((data = {}) => {
          resolve(data);
        })
        .catch((reason) => {
          resolve({});
          console.log(reason);
        });
    });
  };

  render = async () => {
    if (this.theme) {
      this.mainSection.classList.add("du-theme-" + this.theme);
    }

    //if (this.showStargazers || this.showButtonCount) {
    const { stargazers_count } = (await this.getApi()) as any;
    this.stargazers_count = stargazers_count;
    //}

    if (this.showBtn) {
      this.renderButton();
    }

    if (this.showStargazers) {
      this.renderStargazers();
    }

    if (this.goalStep) {
      this.renderGoalStep();
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

    this.mainSection.appendChild(buttonElem);
  };

  renderStargazers = async () => {
    if (this.stargazers_count < 5) return;

    const lastPageIdx = Math.ceil(this.stargazers_count / 100);
    if (typeof lastPageIdx === "undefined") return;

    const users = /*this.mockUsers(); */ await this.getApi(
      `/stargazers?page=${lastPageIdx}&per_page=100`
    );
    if (!(Array.isArray(users) && users.length)) return;

    const recentStargazers = users.slice(
      Math.max(users.length - this.nbItems, 1)
    );
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
        +${(this.stargazers_count - this.nbItems).toLocaleString("en-US")}
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
    this.mainSection.appendChild(stargazersElem);
  };

  renderGoalStep = () => {
    if (!this.stargazers_count) {
      return;
    }

    let nextTarget =
      Math.floor(this.stargazers_count / this.goalStep) * this.goalStep;

    if (nextTarget % this.goalStep === 0) {
      nextTarget += this.goalStep;
    }

    const percentageComplete = Math.floor(
      (this.stargazers_count * 100) / nextTarget
    );

    const goalWrapper = document.createElement("div");
    goalWrapper.className = "du-goal-wrapper";

    const goalContainer = document.createElement("div");
    goalContainer.className = "du-goal-container";

    const goalCurrent = document.createElement("div");
    goalCurrent.className = "du-goal-current";
    goalCurrent.style.width = percentageComplete + "%";

    goalContainer.appendChild(goalCurrent);
    goalWrapper.appendChild(goalContainer);

    const goalText = document.createElement("div");
    goalText.className = "du-goal-text";
    goalText.innerHTML = `<b>Goal:</b> ${this.stargazers_count.toLocaleString(
      "en-US"
    )} / ${nextTarget.toLocaleString("en-US")} (${percentageComplete}%)`;

    goalWrapper.appendChild(goalText);

    this.secondarySection.appendChild(goalWrapper);
  };
}

export default Starcounter;
