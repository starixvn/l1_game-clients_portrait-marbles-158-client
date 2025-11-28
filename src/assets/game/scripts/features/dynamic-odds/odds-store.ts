import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { BetOptionsData } from "../types";

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
    private _oldOdds: BetOptionsData = {};
    private _odds: BetOptionsData = {};

    get odds() {
        return this._odds;
    }

    set odds(odds: BetOptionsData) {
        this._odds = odds;
    }

    get oddsWithConfig(): OddsWithConfig {
        const deltaOdds = this.deltaForAllBetOptions(this._oldOdds, this._odds);

        return {
            odds: this._odds,
            fractional: this.mainPlayerStore.fractionalOddsFormat,
            deltaOdds,
        };
    }

    resetOdds() {
        const odds: BetOptionsData = {};
        Object.keys(this._odds || {}).forEach((choice) => {
            odds[choice] = 0;
        });

        this._oldOdds = { ...odds };
        this._odds = { ...odds };
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
