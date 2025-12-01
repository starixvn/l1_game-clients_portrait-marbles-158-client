import gc from "@sg/game-client-base";
import { _decorator, Label, log, Node } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { ComponentUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { OddsStore, OddsWithConfig } from "../../features/dynamic-odds/odds-store";
import { PointsStore } from "../../features/points/points-store";
import { MarbleRoundTimeStore } from "../../features/rounds/marble-round-time-store";
import { TRANSLATE_NAMESPACE } from "../../game-settings";
import { BetOptionsData } from "../../types";

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

    protected readonly POINTS_SUPPORTED_BET_CHOICES = ["over", "under"];

    onLoad(): void {
        this.updateStatusLabelOdds(true);
        this.hideOddsIndicators();
        super.onLoad();
    }

    @render(MarbleRoundTimeStore, (store) => store.startPlacingBet)
    renderStartPlacingBet(startPlacingBet: boolean) {
        this.toggleBetOption(startPlacingBet);
    }

    @render(MarbleRoundTimeStore, (store) => store.endPlacingBet)
    renderEndPlacingBet(endPlacingBet: boolean) {
        this.toggleBetOption(!endPlacingBet);
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
        log("block bet option ", this.node.name);
        this.setBlockIconVisibility(true);
        this.setDisabledVisibility(true);
        this.hideOddsIndicators();
        this.updateStatusLabelOdds(false);
    }

    updateStatusLabelOdds(status: boolean) {
        this.lblOdds && (this.lblOdds.node.active = status);
    }

    private toggleBetOption(allowBet: boolean) {
        this.setDisabledVisibility(!allowBet);
        this.setBlockIconVisibility(!allowBet);
        if (allowBet) {
            this.updateStatusLabelOdds(true);
        }
    }

    @render(PointsStore, (store) => store.points)
    renderPoints(points: BetOptionsData) {
        if (!this.POINTS_SUPPORTED_BET_CHOICES.includes(this.betChoice)) {
            return;
        }

        const point = points[this.betChoice] ?? 0;
        if (point > 0) {
            this.choice.getComponent(Label).string = gc.Translator.translate(`${TRANSLATE_NAMESPACE}.glossary_${this.betChoice}`, {
                point: point.toString(),
            }).toUpperCase();
        }
    }
}
