import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MarbleServiceMessage } from "../marble-service-message";
import { MARBLE_ROUND_STATE, MarbleRoundTimeStore } from "./marble-round-time-store";

export enum GameFlow {
    Start = "Start",
    Result = "Result",
}

export type MarbleRoundHandlerInput = {
    gameFlow: GameFlow;
};

const { injectable, inject } = inversify;
@injectable()
export class MarbleRoundRunningHandler implements gc.Shared.IMultipleHandlers {
    @inject(MarbleRoundTimeStore) protected readonly roundTimeStore: MarbleRoundTimeStore;
    @inject(gc.Rounds.RoundStore) protected readonly roundStore: gc.Rounds.RoundStore;

    handleGameFlow(input: GameFlow) {
        switch (input) {
            case GameFlow.Start:
                this.roundTimeStore.startNewRound = true;
                this.roundTimeStore.roundState = MARBLE_ROUND_STATE.STARTING_ROUND;
                this.roundStore.resetRoundStore();
                break;
            case GameFlow.Result:
                this.roundTimeStore.endRound = true;
                break;
        }
    }

    stopRunner() {}

    eventHandleList = [
        {
            name: MarbleServiceMessage.GameFlow.eventName,
            handle: this.handleGameFlow,
        },
    ];
}
