import { _decorator, Node } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { ComponentUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { OddsStore, OddsWithConfig } from "../../features/dynamic-odds/odds-store";
import { GamePhase, PhaseId } from "../../features/game-phase/game-phase-definitions";
import { GamePhaseStore } from "../../features/game-phase/game-phase-store";

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
        this.setBlockIconVisibility(false);
        this.hideOddsIndicators();
        super.onLoad();
    }

    @render(OddsStore, (store) => store.oddsWithConfig)
    renderIncreaseOdds(oddsWithConfig: OddsWithConfig) {
        const betChoice = this.betChoice;
        if (!this.isLiveBet(betChoice)) {
            this.hideOddsIndicators();
            return;
        }

        const { odds, deltaOdds } = oddsWithConfig;
        if (+odds[betChoice] <= 0) {
            return;
        }

        const deltaOdd = deltaOdds[betChoice] || 0;
        this.updateOddsIndicators(deltaOdd);
    }

    private isLiveBet(betChoice: string): boolean {
        return betChoice.includes("Live");
    }

    private hideOddsIndicators(): void {
        ComponentUtils.setOpacityNode(this.increaseOdd, 1);
        ComponentUtils.setOpacityNode(this.decreaseOdd, 1);
    }

    private updateOddsIndicators(deltaOdd: number): void {
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

    @render(GamePhaseStore, (store) => store.enterPhase)
    renderExitPhase(phase: GamePhase) {
        if (!phase) {
            return;
        }

        if (phase.id === PhaseId.Halftime || phase.id === PhaseId.Tournament) {
            this.setBlockIconVisibility(false);
            this.updateStatusLabelOdds(true);
        }
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
}
