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
declare class Starcounter implements StarcounterInterface {
    showBtn: boolean;
    showStargazers: boolean;
    showButtonCount: boolean;
    user: string;
    repo: string;
    theme: string;
    nbItems: number;
    wrapperElem: Element;
    mainSection: HTMLDivElement;
    secondarySection: HTMLDivElement;
    endpoint: string;
    stargazersUrl: string;
    repoUrl: string;
    stargazers_count: number;
    goalStep: number;
    constructor({ showBtn, showStargazers, showButtonCount, user, repo, theme, nbItems, goalStep, }: Partial<StarcounterParams>);
    getApi: (path?: string) => Promise<unknown>;
    render: () => Promise<void>;
    renderButton: () => void;
    renderStargazers: () => Promise<void>;
    renderGoalStep: () => void;
}
export default Starcounter;
