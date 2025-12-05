import gc from "@sg/game-client-base";
import { _decorator, Label, log, Node, sp } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { MarbleGameBetHandler } from "../../features/bets/marble-game-bet-handler";
import { OddsStore, OddsWithConfig } from "../../features/dynamic-odds/odds-store";
import { PointsStore } from "../../features/points/points-store";
import { MarbleRoundTimeStore } from "../../features/rounds/marble-round-time-store";
import { TRANSLATE_NAMESPACE } from "../../game-settings";
import { BetOptionsData } from "../../types";

const { property, ccclass } = _decorator;
const { render, handle } = Observer;

enum AnimNames {
    INCREASE_ODD = "odd-up",
    DECREASE_ODD = "odd-down",
}

@ccclass
export default class BetItemCustomize extends BetItem {
    @property(Node)
    increaseOdd: Node = null;

    @property(Node)
    decreaseOdd: Node = null;

    @property(Node)
    blockIcon: Node = null;

    protected readonly POINTS_SUPPORTED_BET_CHOICES = ["over", "under"];
    protected readonly ANIMATION_DURATION = 0.3;

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

    @render(OddsStore, (store) => store.index, { fireImmediately: false })
    renderIndex(index: number) {
        log("render block video index---------", index);
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
        AnimationUtils.fadeOutAndDeactivate(this.increaseOdd, this.ANIMATION_DURATION);
        AnimationUtils.fadeOutAndDeactivate(this.decreaseOdd, this.ANIMATION_DURATION);
    }

    private updateOddsIndicators(deltaOdd: number): void {
        if (deltaOdd === 0) {
            this.hideOddsIndicators();
            return;
        }
        const isIncrease = deltaOdd > 0;
        if (isIncrease) {
            AnimationUtils.fadeOutAndDeactivate(this.decreaseOdd, this.ANIMATION_DURATION);
            Promise.all([
                AnimationUtils.fadeInAndActivate(this.increaseOdd, 0),
                AnimationUtils.playSpine(this.increaseOdd?.getComponent(sp.Skeleton), AnimNames.INCREASE_ODD, false),
            ]);
        } else {
            AnimationUtils.fadeOutAndDeactivate(this.increaseOdd, this.ANIMATION_DURATION);
            Promise.all([
                AnimationUtils.fadeInAndActivate(this.decreaseOdd, 0),
                AnimationUtils.playSpine(this.decreaseOdd?.getComponent(sp.Skeleton), AnimNames.DECREASE_ODD, false),
            ]);
        }
    }

    setBlockIconVisibility(status: boolean) {
        this.blockIcon && (this.blockIcon.active = status);
    }

    blockBetOption() {
        this.setBlockIconVisibility(true);
        this.hideOddsIndicators();
        this.updateStatusLabelOdds(false);
    }

    updateStatusLabelOdds(status: boolean) {
        this.lblOdds && (this.lblOdds.node.active = status);
    }

    private toggleBetOption(allowBet: boolean) {
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

    @handle(MarbleGameBetHandler, (handler, payload: string) => handler.handle(payload))
    override onBet() {
        return this.node.name;
    }
}
