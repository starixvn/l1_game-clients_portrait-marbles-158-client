import gc from "@sg/game-client-base";
import { Button, Node, _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { GamePhase, PhaseId } from "../features/game-phase/game-phase-definitions";
import { GamePhaseStore } from "../features/game-phase/game-phase-store";
import { settings } from "../game-settings";
import { BetChoicesContainer } from "./bet-options/bet-choices-container";
import { AnimationHelper } from "./helpers/animation-helper";
import { DEFAULT_TWEEN_CONFIGS, TweenConfigs, TweenKey } from "./helpers/tween-configs";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

export type BetState = "prev" | "live" | "final";

@ccclass("PlayArea")
export class PlayArea extends ObserverComponent {
    @property(Node)
    chipContainersParent: Node = null;

    @property(BetChoicesContainer)
    betChoicesContainer: BetChoicesContainer = null;

    @property(Node)
    scoreBoard: Node = null;

    @property(Node)
    chips: Node = null;

    @property(Node)
    teamScore: Node = null;

    @property(Node)
    hiddenPlayersNode: Node = null;

    protected isBetOptionsZoomedOut = false;

    protected tweenConfigs: Record<TweenKey, TweenConfigs> = DEFAULT_TWEEN_CONFIGS;

    protected phasePreviewBets: BetState = "prev";
    protected phaseShowBetChoices: BetState = "prev";

    protected betChoicesParentContainer: Node = null;

    onLoad() {
        this.initBetChoicesContainer();
        this.setupStaticTargets();
        super.onLoad();

        this.betChoicesContainer.swapBetsButton.on(Button.EventType.CLICK, this.swapBets, this);
    }

    private initBetChoicesContainer() {
        this.betChoicesParentContainer = this.betChoicesContainer?.betChoicesPrev?.parent;
    }

    protected setupStaticTargets() {
        const staticTargets = [
            { node: this.teamScore, config: this.tweenConfigs.fadeInOut.out },
            { node: this.scoreBoard, config: this.tweenConfigs.fadeInOut.out },
            { node: this.chips, config: this.tweenConfigs.fadeInOut.out },
            { node: this.hiddenPlayersNode, config: this.tweenConfigs.fadeInOut.out },
        ];

        staticTargets.forEach(({ node, config }) => {
            AnimationHelper.setStaticTarget(node, config);
        });
    }

    @render(GamePhaseStore, (store) => store.enterPhase)
    async renderEnterPhase(phase: GamePhase) {
        if (!phase) {
            return;
        }

        if (phase.id === PhaseId.Settlement || phase.id === PhaseId.ShowWinnerAndTournament) {
            this.handleSettlementOrShowWinnerPhase(phase);
            return;
        }

        if (phase.id === PhaseId.MatchWinner) {
            this.handleMatchWinnerPhase(phase);
            return;
        }

        if (phase.id === PhaseId.ShowBetChoicesPrev || phase.id === PhaseId.ShowBetChoicesLive) {
            await this.handleShowBetChoicesPhase(phase);
            return;
        }

        if (phase.id === PhaseId.ShowIntroVideo || phase.id === PhaseId.ShowPrevVideo || phase.id === PhaseId.ShowLiveVideo) {
            await this.handleShowVideoPhase(phase);
        }
    }

    protected handleSettlementOrShowWinnerPhase(phase: GamePhase) {
        AnimationHelper.playAnimByPhaseProgress(this.hiddenPlayersNode, this.tweenConfigs.hiddenPlayersWhenLive.in, phase.progress);
        if (phase.progress === 0) {
            AnimationHelper.playAnimByPhaseProgress([this.betChoicesParentContainer], [this.tweenConfigs.betChoiceSettlement.in], 0);
        }
    }

    protected handleMatchWinnerPhase(phase: GamePhase) {
        if (!this.isBetOptionsZoomedOut) {
            this.zoomBetChoices("out", phase.progress);
        }
        AnimationHelper.playAnimByPhaseProgress([this.hiddenPlayersNode], [this.tweenConfigs.fadeInOut.out], phase.progress);
    }

    protected getShowBetChoicesAnimConfig(): { nodes: Node[]; configs: any[] } {
        return {
            nodes: [this.scoreBoard, this.chips, this.hiddenPlayersNode, this.teamScore, this.betChoicesContainer.swapBetsButton],
            configs: [
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.hiddenPlayersFlyUpBet.in,
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.swapButtonWhenBet.in,
            ],
        };
    }

    protected async handleShowBetChoicesPhase(phase: GamePhase) {
        this.phaseShowBetChoices = phase.id === PhaseId.ShowBetChoicesPrev ? "prev" : "live";
        const zoomPromise = this.isBetOptionsZoomedOut ? this.zoomBetChoices("in", phase.progress) : undefined;
        const { nodes, configs } = this.getShowBetChoicesAnimConfig();
        const animPromise = AnimationHelper.playAnimByPhaseProgress(nodes, configs, phase.progress);
        await Promise.all([zoomPromise, animPromise]);
    }

    protected getShowVideoAnimConfig(): { nodes: Node[]; configs: any[] } {
        return {
            nodes: [this.teamScore, this.scoreBoard, this.chips, this.hiddenPlayersNode, this.betChoicesContainer.swapBetsButton],
            configs: [
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.fadeInOut.out,
                this.tweenConfigs.fadeInOut.out,
                this.tweenConfigs.fadeInOut.out,
                this.tweenConfigs.swapButtonWhenLive.in,
            ],
        };
    }

    protected async handleShowVideoPhase(phase: GamePhase) {
        this.phasePreviewBets = phase.id === PhaseId.ShowLiveVideo ? "live" : "prev";
        const { nodes, configs } = this.getShowVideoAnimConfig();
        const animPromise = AnimationHelper.playAnimByPhaseProgress(nodes, configs, phase.progress);
        const zoomPromise = !this.isBetOptionsZoomedOut ? this.zoomBetChoices("out", phase.progress) : undefined;
        await Promise.all([animPromise, zoomPromise]);
    }

    @render(GamePhaseStore, (store) => store.exitPhase)
    async renderExitPhase(phase: GamePhase) {
        if (!phase) {
            return;
        }

        if (phase.id === PhaseId.Halftime) {
            AnimationHelper.playAnimByPhaseProgress(this.teamScore, this.tweenConfigs.fadeInOut.out, phase.progress);
        }
    }

    @render(gc.Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    async showPlayArea(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        try {
            await AnimationUtils.delayTime(settings.durations.outro);
            this.playOutroAnim();
        } catch (e) {}
    }

    protected playOutroAnim(): void {
        AnimationHelper.playAnimByPhaseProgress(
            [this.teamScore, this.betChoicesParentContainer],
            [this.tweenConfigs.fadeInOut.out, this.tweenConfigs.betChoiceSettlement.in],
            0
        );
    }

    protected async zoomBetChoices(direction: "in" | "out", progress: number): Promise<void> {
        this.isBetOptionsZoomedOut = direction === "out";

        const target = { target: this.betChoicesParentContainer, key: "betChoiceZoomInOut" as TweenKey };
        if (progress === 0) {
            await AnimationHelper.playAnimForTarget(target.target, this.tweenConfigs[target.key][direction]);
        } else {
            await this.setStaticBetChoices(direction);
        }
    }

    private async setStaticBetChoices(direction: "in" | "out"): Promise<void> {
        this.isBetOptionsZoomedOut = direction === "out";

        const target = { target: this.betChoicesParentContainer, key: "betChoiceZoomInOut" as TweenKey };
        AnimationHelper.setStaticTarget(target.target, this.tweenConfigs[target.key][direction]);
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    swapBets() {
        if (this.phaseShowBetChoices === "live" || this.phasePreviewBets === "live") {
            const isSwapBets = this.betChoicesContainer.getIsSwapBets();
            this.betChoicesContainer.setIsSwapBets(!isSwapBets);
            this.betChoicesContainer.setEnableBetChoices("live");
        }
    }
}
