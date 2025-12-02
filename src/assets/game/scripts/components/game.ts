import { _decorator } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import gc from "@sg/game-client-base";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { siteConfigs } from "../../../../assets/scripts/site-configs";
import "../../../resources/i18n";
import { containerOptions } from "../container-options";
import { settings } from "../game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
const { Settlements } = gc;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ visible: false, override: true })
    override lblMinBet = null;

    @property({ visible: false, override: true })
    override lblMaxBet = null;

    @property(ChipFlying)
    chipFlying: ChipFlying = null;

    enableFixHandleFinish = true;

    @handle(gc.Rounds.RoundRunningHandlers, (handle) => handle.stopRunner())
    stopRoundTimeRunner() {}

    @render(Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish || !this.enableFixHandleFinish) {
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
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    async showResult(
        result: gc.GameServiceMessage.TResult,
        hasAnimation: boolean,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ) {
        return Promise.resolve();
    }
}
