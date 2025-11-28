import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

export type OddsWithConfig = {
    odds: Record<string, number>;
    fractional: boolean;
    deltaOdds: Record<string, number>;
};

@injectable()
export class OddsStore {
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }
    private _oldOdds = {};
    private _odds = {};

    get odds() {
        return this._odds;
    }

    set odds(odds: Record<string, number>) {
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
        const odds = {};
        Object.keys(this._odds || {}).forEach((choice) => {
            odds[choice] = 0;
        });

        this._oldOdds = { ...odds };
        this._odds = { ...odds };
    }

    deltaForAllBetOptions(odds: Record<string, number>, oldOdds: Record<string, number>) {
        const deltaOdds = {};
        for (const betOptionName of Object.keys(odds)) {
            deltaOdds[`${betOptionName}`] = this.deltaOdds(odds[`${betOptionName}`] || 0, oldOdds[`${betOptionName}`] || 0);
        }
        return deltaOdds;
    }

    deltaOdds(oldOdds: number, newOdds: number) {
        return newOdds - oldOdds;
    }
}
