import { _decorator, Node } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { ComponentUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { OddsStore, OddsWithConfig } from "../../features/dynamic-odds/odds-store";
import { MarbleBetStore } from "../../features/bet/bet-store";

const { property, ccclass } = _decorator;
const { render } = Observer;

@ccclass
export default class BetItemCustomize extends BetItem {
    @property(Node)
    increaseOdd: Node = null;

    @property(Node)
    decreaseOdd: Node = null;

    @property(Node)
    disableNode: Node = null;

    @property(Node)
    blockIcon: Node = null;

    onLoad(): void {
        this.updateStatusLabelOdds(true);
        this.hideOddsIndicators();
        super.onLoad();
    }

    @render(MarbleBetStore, (store) => store.allowBet)
    renderAllowBet(allowBet: boolean) {
        this.toggleBetOption(allowBet);
    }

    @render(OddsStore, (store) => store.oddsWithConfig)
    renderIncreaseOdds(oddsWithConfig: OddsWithConfig) {
        const betChoice = this.betChoice;

        const { odds, deltaOdds } = oddsWithConfig;
        if (odds[betChoice] <= 0) {
            return;
        }

        const deltaOdd = deltaOdds[betChoice] ?? 0;
        this.updateOddsIndicators(deltaOdd);
    }

    private hideOddsIndicators(): void {
        ComponentUtils.setOpacityNode(this.increaseOdd, 1);
        ComponentUtils.setOpacityNode(this.decreaseOdd, 1);
    }

    private updateOddsIndicators(deltaOdd: number): void {
        if (deltaOdd === 0) {
            ComponentUtils.setOpacityNode(this.increaseOdd, 1);
            ComponentUtils.setOpacityNode(this.decreaseOdd, 1);
            return;
        }
        const isIncrease = deltaOdd > 0;
        ComponentUtils.setOpacityNode(this.increaseOdd, isIncrease ? 255 : 1);
        ComponentUtils.setOpacityNode(this.decreaseOdd, isIncrease ? 1 : 255);
    }

    setDisabledVisibility(status: boolean) {
        this.disableNode && (this.disableNode.active = status);
    }

    setBlockIconVisibility(status: boolean) {
        this.blockIcon && (this.blockIcon.active = status);
    }

    blockBetOption() {
        this.setBlockIconVisibility(true);
        this.setDisabledVisibility(true);
        this.hideOddsIndicators();
        this.updateStatusLabelOdds(false);
    }

    updateStatusLabelOdds(status: boolean) {
        this.lblOdds.node.active = status;
    }

    private toggleBetOption(allowBet: boolean) {
        this.setDisabledVisibility(!allowBet);
        this.setBlockIconVisibility(!allowBet);
    }
}
