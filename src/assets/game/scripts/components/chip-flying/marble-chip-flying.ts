import { _decorator } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { ChipFlying } from "../../../../../extensions/shared-components/assets/game/chip-flying/scripts/components/chip-flying";
import { MarbleRoundTimeStore } from "../../features/rounds/marble-round-time-store";

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass
export class MarbleChipFlying extends ChipFlying {
    @render(MarbleRoundTimeStore, (store) => store.startNewRound)
    startNewRound(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.resetSettlementStatus();
    }

    override async actionPayChips(animated: boolean) {
        await AnimationUtils.delayTime(this.chipDelayFlyingTime * 2);

        this.showPayoutForMainPlayer();
    }

    protected showPayoutForMainPlayer() {
        if (this.settlementStatus?.win) {
            this.mainPlayerIncreaseBalance(this.settlementStatus?.bet);
            this.mainPlayerPlayWinningEffect();
            if (this.settlementStatus?.reachMaxWin && this.settlementStatus.reachMaxWin) {
                this.handleReachMaxWin();
            }

            this.getBalance();
            this.resetSettlementStatus();
        }
    }

    @render(MarbleRoundTimeStore, (store) => store.endPlacingBet)
    clearChipsAllBetItems(endPlacingBet: boolean) {
        if (endPlacingBet) {
            this.chipStorage = {};
            this.currentChipContainer.destroyAllChildren();
        }
    }
}
