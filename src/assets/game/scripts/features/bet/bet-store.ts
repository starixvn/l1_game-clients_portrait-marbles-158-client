import inversify from "inversify";
import mobx from "mobx";

const { injectable } = inversify;

@injectable()
export class MarbleBetStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _allowBet = false;

    get allowBet() {
        return this._allowBet;
    }

    set allowBet(allowBet: boolean) {
        this._allowBet = allowBet;
    }
}