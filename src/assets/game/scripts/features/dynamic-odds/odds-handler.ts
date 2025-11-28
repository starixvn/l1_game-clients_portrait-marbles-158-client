import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { BetOptionsData } from "../../types";
import { MarbleRoundTimeStore } from "../rounds/marble-round-time-store";
import { OddsStore } from "./odds-store";

const { injectable, inject } = inversify;

@injectable()
export class OddsHandler implements gc.Shared.IMultipleHandlers {
    @inject(OddsStore) private readonly oddsStore: OddsStore;
    @inject(MarbleRoundTimeStore) private readonly marbleRoundTimeStore: MarbleRoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);

        setTimeout(() => {
            mobx.reaction(
                () => this.marbleRoundTimeStore.endPlacingBet,
                (endPlacingBet) => {
                    if (endPlacingBet) {
                        this.resetOdds();
                    }
                }
            );
        }, 0);
    }

    eventHandleList = [
        {
            name: gc.Shared.GameServiceMessage.GameOdds.eventName,
            handle: this.handleOdd,
        },
        {
            name: "previousOdds",
            handle: this.handlePreviousOdds,
        },
    ];

    handleOdd(input: BetOptionsData) {
        this.oddsStore.odds = input;
    }
    handlePreviousOdds(input: BetOptionsData) {
        this.oddsStore.previousOdds = input;
    }

    resetOdds() {
        this.oddsStore.resetOdds();
    }
}
