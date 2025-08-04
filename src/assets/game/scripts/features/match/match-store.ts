import inversify from "inversify";
import mobx from "mobx";
import { log } from "cc";

const { injectable } = inversify;

interface Match {
    home: string;
    away: string;
}

@injectable()
export class MatchStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _match?: Match;

    get match() {
        return this._match;
    }

    set match(match: Match) {
        log("RECEIVED MATCH", match);
        this._match = match;
    }
}