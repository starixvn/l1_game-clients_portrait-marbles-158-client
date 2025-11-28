import Observer from "observer";
import { ChipFlying } from "../../../../../extensions/shared-components/assets/game/chip-flying/scripts/components/chip-flying";
import { _decorator } from "cc";
import { MarbleRoundTimeStore } from "../../features/rounds/marble-round-time-store";

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass
export class MarbleChipFlying extends ChipFlying {
    @render(MarbleRoundTimeStore, (store) => store.startNewRound)
    startNewRound(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.resetSettlementStatus();
    }
}
