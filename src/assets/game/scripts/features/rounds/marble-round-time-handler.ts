import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MARBLE_ROUND_STATE, MarbleRoundTimeStore } from "./marble-round-time-store";
const { injectable, inject } = inversify;

@injectable()
export class MarbleRoundTimeHandlers implements gc.Shared.IMultipleHandlers {
    @inject(MarbleRoundTimeStore) protected readonly store: MarbleRoundTimeStore;

    handleStartPlacingBetStatus(spb: boolean) {
        this.store.startPlacingBet = spb;
        this.store.endPlacingBet = !spb;

        if (spb) {
            this.store.roundState = MARBLE_ROUND_STATE.PLACING_BET;
        }
    }

    handleEndPlacingBetStatus(epb: boolean) {
        this.store.endPlacingBet = epb;
        this.store.startPlacingBet = !epb;

        if (epb) {
            this.store.roundState = MARBLE_ROUND_STATE.LOCKING_BET;
        }
    }

    handleEndRoundStatus(finish: gc.GameServiceMessage.Finish | undefined) {
        if (finish) {
            this.store.endRound = true;
            this.store.endPlacingBet = false;
            this.store.startPlacingBet = false;
            this.store.startNewRound = false;
            this.store.roundState = MARBLE_ROUND_STATE.SHOW_RESULT;
        }
    }

    eventHandleList = [
        {
            name: gc.GameServiceMessage.spb,
            handle: this.handleStartPlacingBetStatus,
        },
        {
            name: gc.GameServiceMessage.epb,
            handle: this.handleEndPlacingBetStatus,
        },
        {
            name: gc.GameServiceMessage.Finish.eventName,
            handle: this.handleEndRoundStatus,
        },
    ];
}
