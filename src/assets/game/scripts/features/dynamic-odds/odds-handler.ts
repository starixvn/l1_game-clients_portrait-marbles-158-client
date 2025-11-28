import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { MarbleRoundTimeStore } from "../rounds/marble-round-time-store";
import { BetOptionsData } from "../types";
import { OddsStore } from "./odds-store";

const { injectable, inject } = inversify;

@injectable()
export class OddsHandler implements gc.Shared.IHandler<BetOptionsData> {
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

    name = gc.Shared.GameServiceMessage.GameOdds.eventName;
    handle(input: BetOptionsData) {
        this.oddsStore.odds = input;
    }

    resetOdds() {
        this.oddsStore.resetOdds();
    }
}
