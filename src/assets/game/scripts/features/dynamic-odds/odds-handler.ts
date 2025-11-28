import gc from "@sg/game-client-base";
import inversify from "inversify";
import { OddsStore } from "./odds-store";
import { MarbleRoundTimeStore } from "../rounds/marble-round-time-store";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class OddsHandler implements gc.Shared.IHandler<Record<string, number>> {
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
    handle(input: Record<string, number>) {
        this.oddsStore.odds = input;
    }

    resetOdds() {
        this.oddsStore.resetOdds();
    }
}
