import { _decorator } from "cc";
import { PromptMessageContainer } from "db://shared-components/game/prompt-message/scripts/prompt-message-container";
import Observer from "observer";
import { MatchPromptMessage } from "./match-promt-message";
import { MarbleRoundTimeStore } from "../../features/rounds/marble-round-time-store";

const { ccclass } = _decorator;
const { render } = Observer;

const PROMPT_SOUND_ID = {
    START_BETTING: "start-betting",
    NEXT_MATCH: "next-match",
    STOP_BETTING: "stop-betting",
};

@ccclass("MatchPromptMessageContainer")
export class MatchPromptMessageContainer extends PromptMessageContainer {
    promptMessageComponent: MatchPromptMessage;

    @render(MarbleRoundTimeStore, (store) => store.endPlacingBet)
    async showMatchMessage(endPlacingBet: boolean) {
        if (endPlacingBet) {
            this.scheduleOnce(() => this.getComponent()?.showTimeUpMessage(), 0.5);
        }
    }

    @render(MarbleRoundTimeStore, (store) => store.isStartingRound)
    showStartBetMessage(isStartingRound: boolean) {
        if (isStartingRound) {
            this.scheduleOnce(() => {
                this.getComponent()?.showStartBetMessage();
                this.playSound(PROMPT_SOUND_ID.START_BETTING);
            }, 1);
        }
    }

    @render(MarbleRoundTimeStore, (store) => store.endPlacingBet)
    renderIsStartLocking(endPlacingBet: boolean) {
        if (!this.shortLockingDuration && endPlacingBet) {
            this.getComponent()?.showStopBetMessage();
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
}
