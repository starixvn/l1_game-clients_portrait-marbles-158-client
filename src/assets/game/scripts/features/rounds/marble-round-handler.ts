import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MarbleRoundTimeStore } from "./marble-round-time-store";

export enum GameFlow {
    Start = "Start",
    Result = "Result",
}

export type MarbleRoundHandlerInput = {
    gameFlow: GameFlow;
};

const { injectable, inject } = inversify;
@injectable()
export class MarbleGameFlowHandler implements gc.Shared.IHandler<any> {
    name = "gameFlow";

    @inject(MarbleRoundTimeStore) protected readonly roundTimeStore: MarbleRoundTimeStore;
    @inject(gc.Rounds.RoundStore) protected readonly roundStore: gc.Rounds.RoundStore;

    handle(input: GameFlow) {
        switch (input) {
            case GameFlow.Start:
                this.roundTimeStore.startNewRound = true;
                this.roundStore.resetRoundStore();
                break;
            case GameFlow.Result:
                this.roundTimeStore.endRound = true;
                break;
        }
    }
}
