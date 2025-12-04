import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { BetOptionsData } from "../../types";
import { MarbleServiceMessage } from "../marble-service-message";
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

    handleOdds(input: BetOptionsData) {
        this.oddsStore.odds = input;
    }

    handlePreviousOdds(input: BetOptionsData) {
        this.oddsStore.previousOdds = input;
    }

    handlePoints(input: BetOptionsData) {
        this.oddsStore.points = input;
    }
    handleIndex(input: number) {
        this.oddsStore.index = input;
    }
    handleLatestIndex(input: number) {
        this.oddsStore.latestIndex = input;
    }

    resetOdds() {
        this.oddsStore.resetOdds();
    }

    eventHandleList = [
        {
            name: gc.Shared.GameServiceMessage.GameOdds.eventName,
            handle: this.handleOdds,
        },
        {
            name: MarbleServiceMessage.PreviousOdds.eventName,
            handle: this.handlePreviousOdds,
        },
        {
            name: MarbleServiceMessage.OddsPoints.eventName,
            handle: this.handlePoints,
        },
        {
            name: MarbleServiceMessage.OddsIndex.eventName,
            handle: this.handleIndex,
        },
        {
            name: MarbleServiceMessage.OddsLatestIndex.eventName,
            handle: this.handleLatestIndex,
        },
    ];
}
