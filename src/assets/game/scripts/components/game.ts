import { _decorator } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import gc from "@sg/game-client-base";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { siteConfigs } from "../../../../assets/scripts/site-configs";
import "../../../resources/i18n";
import { containerOptions } from "../container-options";
import { settings } from "../game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ visible: false, override: true })
    override lblMinBet = null;

    @property({ visible: false, override: true })
    override lblMaxBet = null;

    enableFixHandleFinish = true;

    @handle(gc.Rounds.RoundRunningHandlers, (handle) => handle.stopRunner())
    stopRoundTimeRunner() {}

    override renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {}
    override async showResult(
        result: gc.GameServiceMessage.TResult,
        hasAnimation: boolean,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ) {}
}
