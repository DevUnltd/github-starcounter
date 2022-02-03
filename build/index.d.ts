import "./index.css";
interface StarcounterInterface {
    showBtn: boolean;
    showStargazers: boolean;
    showButtonCount: boolean;
    user: string;
    repo: string;
    theme: string;
    nbItems: number;
}
interface StarcounterParams {
    showBtn: string;
    showStargazers: string;
    showButtonCount: string;
    user: string;
    repo: string;
    theme: string;
    nbItems: number;
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
    endpoint: string;
    stargazersUrl: string;
    repoUrl: string;
    stargazers_count: number;
    constructor({ showBtn, showStargazers, showButtonCount, user, repo, theme, nbItems, }: Partial<StarcounterParams>);
    getApi: (path?: string) => Promise<unknown>;
    render: () => Promise<void>;
    renderButton: () => void;
    renderStargazers: () => Promise<void>;
}
export default Starcounter;
