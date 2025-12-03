import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import Observer from "observer";
import { MarbleRoundTimeStore } from "../../features/rounds/marble-round-time-store";
import { MatchPromptMessage } from "./match-promt-message";

const { ccclass } = _decorator;
const { render, handle } = Observer;

const PROMPT_SOUND_ID = {
    START_BETTING: "start-betting",
    NEXT_MATCH: "next-match",
    STOP_BETTING: "stop-betting",
};

@ccclass("MatchPromptMessageContainer")
export class MatchPromptMessageContainer extends NodeContainer {
    promptMessageComponent: MatchPromptMessage;

    @render(MarbleRoundTimeStore, (store) => store.endRound)
    async showTimeUpMessage(endRound: boolean) {
        if (endRound) {
            this.getComponent()?.showTimeUpMessage();
        }
    }

    @render(MarbleRoundTimeStore, (store) => store.startPlacingBet)
    showStartBetMessage(startPlacingBet: boolean) {
        if (startPlacingBet) {
            this.playSound(PROMPT_SOUND_ID.START_BETTING);
        }
    }

    @render(MarbleRoundTimeStore, (store) => store.endPlacingBet)
    showStopBetMessage(endPlacingBet: boolean) {
        if (endPlacingBet) {
            this.playSound(PROMPT_SOUND_ID.STOP_BETTING);
        }
    }

    getComponent() {
        if (!this.promptMessageComponent) {
            const node = this.createNode();
            this.promptMessageComponent = node.getComponent(MatchPromptMessage);
        }

        return this.promptMessageComponent;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }
}
