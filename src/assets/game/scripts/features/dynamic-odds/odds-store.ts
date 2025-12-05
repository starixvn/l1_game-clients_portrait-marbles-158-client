import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { BET_OPTIONS_KEYS, BetOptionsData } from "../../types";

const { injectable, inject } = inversify;

export type OddsWithConfig = {
    odds: BetOptionsData;
    fractional: boolean;
    deltaOdds: BetOptionsData;
};

@injectable()
export class OddsStore {
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }
    private _previousOdds: BetOptionsData = {};
    private _odds: BetOptionsData = {};
    private _points: BetOptionsData = {};
    private _index = -1;
    private _latestIndex = -1;

    set index(index: number) {
        this._index = index;
    }

    get index() {
        return this._index;
    }

    get latestIndex() {
        return this._latestIndex;
    }
    set latestIndex(latestIndex: number) {
        this._latestIndex = latestIndex;
    }

    get odds() {
        return this._odds;
    }

    set odds(odds: BetOptionsData) {
        const clonedOdds = { ...odds };
        BET_OPTIONS_KEYS.forEach((key) => {
            if (clonedOdds[key] === undefined) {
                clonedOdds[key] = 0;
            }
        });

        this._odds = clonedOdds;
    }

    set previousOdds(previousOdds: BetOptionsData) {
        this._previousOdds = previousOdds;
    }

    get previousOdds() {
        return this._previousOdds;
    }

    get points() {
        return this._points;
    }

    set points(points: BetOptionsData) {
        this._points = points;
    }

    get oddsWithConfig(): OddsWithConfig {
        const deltaOdds = this.deltaForAllBetOptions(this._previousOdds, this._odds);

        return {
            odds: this.odds,
            fractional: this.mainPlayerStore.fractionalOddsFormat,
            deltaOdds,
        };
    }

    get isFinalBlock() {
        return this.index === this.latestIndex;
    }

    zeroOdds() {
        const odds: BetOptionsData = {};
        Object.keys(this.odds || {}).forEach((choice) => {
            odds[choice] = 0;
        });

        this._previousOdds = { ...this.odds };
        this._odds = { ...odds };
    }

    deltaForAllBetOptions(previousOdds: BetOptionsData, odds: BetOptionsData) {
        const deltaOdds: BetOptionsData = {};
        const safePreviousOdds = previousOdds || {};
        if (Object.keys(safePreviousOdds).length === 0) {
            for (const betOptionName of Object.keys(odds)) {
                deltaOdds[`${betOptionName}`] = 0;
            }
            return deltaOdds;
        }

        for (const betOptionName of Object.keys(odds)) {
            deltaOdds[`${betOptionName}`] = this.deltaOdds(safePreviousOdds[`${betOptionName}`] || 0, odds[`${betOptionName}`] || 0);
        }
        return deltaOdds;
    }

    deltaOdds(previousOdds: number, odds: number) {
        return odds - previousOdds;
    }

    resetAllOdds() {
        this._previousOdds = {};
        this._odds = {};
        this._points = {};
        this._index = -1;
        this._latestIndex = -1;
    }
}
