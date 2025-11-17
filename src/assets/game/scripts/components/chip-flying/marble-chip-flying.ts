import Observer from "observer";
import { ChipFlying } from "../../../../../extensions/shared-components/assets/game/chip-flying/scripts/components/chip-flying";
import gc from "@sg/game-client-base";
import { _decorator } from "cc";

const { Rounds } = gc;

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass
export class MarbleChipFlying extends ChipFlying {
    @render(Rounds.RoundTimeStore, (store) => store.startNewRound)
    startNewRound(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.resetSettlementStatus();
    }
}