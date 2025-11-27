import { _decorator, Node } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import gc from "@sg/game-client-base";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import { siteConfigs } from "../../../../assets/scripts/site-configs";
import "../../../resources/i18n";
import { containerOptions } from "../container-options";
import { settings } from "../game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
const SHOW_RESULT_SOUND = "show-result";

const { sentryLogger } = gc;
@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ visible: false, override: true })
    override lblMinBet = null;

    @property({ visible: false, override: true })
    override lblMaxBet = null;

    @property(Node)
    nodeChipFlying: Node = null;

    @property(Node)
    nodeSystemIndicator: Node = null;

    @property
    isPortrait = false;

    private currentFinish: gc.GameServiceMessage.Finish = null;
    enableFixHandleFinish = true;

    private _chipFlying: ChipFlying = null;

    get chipFlying() {
        if (!this._chipFlying) {
            this._chipFlying = this.nodeChipFlying.getComponentInChildren(ChipFlying);
        }
        return this._chipFlying;
    }

    override renderRoundId(roundId: number) {}

    protected onEnable(): void {}

    @handle(gc.Rounds.RoundRunningHandlers, (handle) => handle.stopRunner())
    stopRoundTimeRunner() {}

    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        this.currentFinish = currentFinish;
        if (!currentFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }
        this.showResult(result, true, settlementResult).then(() => {
            this.finishShowResult(result, settlementResult);
            this.chipFlying.callActionPayChips();
        });
        this.scheduleOnce(() => {
            this.playSound(SHOW_RESULT_SOUND);
        }, 0.5);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const roundTime = firstJoinGameHistory.roundTime;
        const lastRound = firstJoinGameHistory.roundHistory as any;
        if (lastRound) {
            const { result, settlementResult } = lastRound;
            if (firstJoinGameHistory.animationHighlight) {
                if (roundTime === 0) {
                    await AnimationUtils.delayTime(1);
                    if (this.currentFinish) {
                        return;
                    }
                    this.showResult(result, false, settlementResult);
                } else {
                    this.showResult(result, false, settlementResult);
                }
            }
        }
    }
}
