import { _decorator, assetManager, ImageAsset, log, Node } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import gc from "@sg/game-client-base";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import "../../../resources/i18n";
import { BackgroundVideoPlayer } from "../../../scripts/background-video-player";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions } from "../container-options";
import { GamePhase, PhaseId, TimePointTournament } from "../features/game-phase/game-phase-definitions";
import { GamePhaseStore } from "../features/game-phase/game-phase-store";
import { settings } from "../game-settings";
import { DOMBackgroundImage } from "./../../../scripts/dom-background-image";
import { MatchResult } from "./match-result";
import { NetworkStatus, SystemIndicator } from "./system-indicator";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
const SHOW_RESULT_SOUND = "show-result";

const { sentryLogger } = gc;
@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ visible: false, override: true })
    override lblMinBet = null;

    @property({ visible: false, override: true })
    override lblMaxBet = null;

    @property(Node)
    nodeChipFlying: Node = null;

    @property(Node)
    betResultNode: Node = null;

    @property(BackgroundVideoPlayer)
    backgroundVideoPlayer: BackgroundVideoPlayer = null;

    @property(Node)
    nodeSystemIndicator: Node = null;

    @property
    isPortrait = false;

    private currentFinish: gc.GameServiceMessage.Finish = null;
    enableFixHandleFinish = true;
    private _systemIndicator: SystemIndicator = null;

    get systemIndicator() {
        if (!this._systemIndicator) {
            this._systemIndicator = this.nodeSystemIndicator.getComponentInChildren(SystemIndicator);
        }
        return this._systemIndicator;
    }

    private isPhaseWinner = false;

    private _chipFlying: ChipFlying = null;

    get chipFlying() {
        if (!this._chipFlying) {
            this._chipFlying = this.nodeChipFlying.getComponentInChildren(ChipFlying);
        }
        return this._chipFlying;
    }

    override onHideGame() {
        this.backgroundVideoPlayer.stop();
    }

    override renderRoundId(roundId: number) {}

    protected onEnable(): void {
        this.initBackgroundImage();
    }

    @handle(gc.Rounds.RoundRunningHandlers, (handle) => handle.stopRunner())
    stopRoundTimeRunner() {}

    @render(gc.Connection.ConnectionStore, (store) => store.isConnectFailed)
    handleConnectFailed(isConnectFailed: boolean) {
        if (isConnectFailed) {
            log("Connection failed");
            this.systemIndicator.networkStatus = NetworkStatus.DISCONNECTED;
            this.scheduleOnce(() => {
                this.stopRoundTimeRunner();
                this.backgroundVideoPlayer.pause();
            }, 3);
        }
    }


    @render(gc.Rounds.RoundTimeStore, (store) => store.roundTime)
    renderRoundTime(roundTime: number) {
        if (this.isPhaseWinner && roundTime <= TimePointTournament) {
            this.isPhaseWinner = false;
        }
    }
    
    initBackgroundImage() {
        const { origin, pathname } = window.location;
        const name = this.isPortrait ? "background-portrait.webp" : "background.webp";
        const imagePath = `${origin}${pathname}splash-resources/${name}?v=7`;
        assetManager.loadRemote<ImageAsset>(imagePath, (err, imageAsset) => {
            if (err) {
                sentryLogger?.logError(`Failed to load image asset ${imagePath} with error ${err}`);
                return;
            }

            const nativeUrl = imageAsset.nativeUrl;

            DOMBackgroundImage.createBackgroundImageElement(nativeUrl);
        });
    }

    async showResult(
        result: gc.GameServiceMessage.TResult,
        hasAnimation: boolean,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ) {
        try {
            let matchResult = this.betResultNode.getComponentInChildren(MatchResult);
            while (!matchResult) {
                await AnimationUtils.delayTime(100/1000);
                matchResult = this.betResultNode.getComponentInChildren(MatchResult);
            }
            if (hasAnimation) {
                await AnimationUtils.delayTime(settings.durations.outro);
                await matchResult.show(hasAnimation);
            } else {
                matchResult.show(false);
            }
        } catch (e) {
            log("showResult error", e);
        }
    }

    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        this.currentFinish = currentFinish;
        if (!currentFinish) {
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
        this.scheduleOnce(() => {
            this.playSound(SHOW_RESULT_SOUND);
        }, 0.5);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const roundTime = firstJoinGameHistory.roundTime;
        const lastRound = firstJoinGameHistory.roundHistory as any;
        if (lastRound) {
            const { result, settlementResult } = lastRound;
            if (firstJoinGameHistory.animationHighlight) {
                if (roundTime === 0) {
                    await AnimationUtils.delayTime(1);
                    if (this.currentFinish) {
                        return;
                    }
                    this.showResult(result, false, settlementResult);
                } else {
                    this.showResult(result, false, settlementResult);
                }
            }
        }
    }
}
