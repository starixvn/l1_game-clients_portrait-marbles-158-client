import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { BetOptionsData } from "../../types";

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

    get odds() {
        return this._odds;
    }

    set odds(odds: BetOptionsData) {
        this._odds = odds;
    }

    set previousOdds(previousOdds: BetOptionsData) {
        this._previousOdds = previousOdds;
    }

    get previousOdds() {
        return this._previousOdds;
    }

    get oddsWithConfig(): OddsWithConfig {
        const deltaOdds = this.deltaForAllBetOptions(this._previousOdds, this.previousOdds);

        return {
            odds: this.odds,
            fractional: this.mainPlayerStore.fractionalOddsFormat,
            deltaOdds,
        };
    }

    resetOdds() {
        const odds: BetOptionsData = {};
        Object.keys(this.odds || {}).forEach((choice) => {
            odds[choice] = 0;
        });

        this._previousOdds = { ...odds };
    }

    deltaForAllBetOptions(odds: BetOptionsData, oldOdds: BetOptionsData) {
        const deltaOdds: BetOptionsData = {};
        for (const betOptionName of Object.keys(odds)) {
            deltaOdds[`${betOptionName}`] = this.deltaOdds(odds[`${betOptionName}`] || 0, oldOdds[`${betOptionName}`] || 0);
        }
        return deltaOdds;
    }

    deltaOdds(oldOdds: number, newOdds: number) {
        return newOdds - oldOdds;
    }
}
