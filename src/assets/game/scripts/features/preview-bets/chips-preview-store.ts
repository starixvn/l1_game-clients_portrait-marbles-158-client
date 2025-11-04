import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { MarbleRoundTimeStore } from "../rounds/marble-round-time-store";

const { injectable, inject } = inversify;

@injectable()
export class ChipsPreviewStore {
    @inject(gc.Rounds.RoundTimeStore) roundTimeStore: MarbleRoundTimeStore;
    @inject(gc.Settlements.SettlementStore) settlementStore: gc.Settlements.SettlementStore;

    constructor() {
        mobx.makeAutoObservable(this);
        mobx.reaction(
            () => this.settlementStore?.settlementResult,
            () => {
                this._settlementResult = this.settlementStore?.settlementResult || {};
            }
        );
        mobx.when(
            () => this.roundTimeStore?.isPreparingBetPreMatch,
            () => {
                this._chips = {};
            }
        );
    }

    private _settlementResult: gc.GameServiceMessage.TSettlementResult = {};
    private _chips: Record<string, any> = {};

    get chips() {
        return this._chips;
    }

    set chips(chips: Record<string, any>) {
        this._chips = chips;
    }

    get settlementResult() {
        return this._settlementResult;
    }
}
