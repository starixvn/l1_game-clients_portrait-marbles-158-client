import gc from "@sg/game-client-base";
import { _decorator, Node, tween } from "cc";
import { AroundTablePlayerUtils } from "db://shared-components/game/around-table-player/scripts/utils";
import { TBalanceEffect, TWinningEffect } from "db://shared-components/game/balance-effect/scripts/stores/balance-effect-store";
import { ActionChipFlying, addChipsToChipBoxWhenJoinRoom } from "db://shared-components/game/chip-flying/scripts/components/actions";
import { ChipFlying as ChipFlyingShared, IChipFlyingInfo } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { GamePhase, PhaseId } from "../features/game-phase/game-phase-definitions";
import { GamePhaseStore } from "../features/game-phase/game-phase-store";
import { ChipsPreviewStore } from "../features/preview-bets/chips-preview-store";
import { BetChoicesContainer } from "./bet-options/bet-choices-container";
import { BetItemsFinal } from "./bet-options/bet-items-final";
import { BetItems } from "./bet-options/bet-items";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { Chips } = gc;

const CHIP_SOUND_ID = {
    GATHER_CHIPS: "gather-chips",
    DIVIDE_CHIPS: "divide-chips",
    PAY_CHIPS: "pay-chips",
};

@ccclass("ChipFlying")
export class ChipFlying extends ChipFlyingShared {
    @property(BetChoicesContainer)
    betChoicesContainer: BetChoicesContainer = null;

    @property(Node)
    chipContainer: Node = null;

    protected delayGetChips = 0.5;

    chipByChipComponents: Record<string, Node> = {};

    onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        this.chipContainer.active = true;
    }

    actionPayChips(animated: boolean) {
        if (!animated) {
            ActionChipFlying.dealerGetChips(this.dealerChipBox, this.betItems?.lostBetItems, this);
            ActionChipFlying.dealerPayChips(this.dealerChipBox, this.betItems?.winBetItems, this);
            this.payChipToAllPlayersNew();
            return;
        }

        tween(this.node)
            .delay(this.delayGetChips)
            .call(() => {
                if (this.betItems?.lostBetItems?.length > 0) {
                    this.handlePlaySound(CHIP_SOUND_ID.GATHER_CHIPS);
                }
                ActionChipFlying.dealerGetChips(this.dealerChipBox, this.betItems?.lostBetItems, this);
            })
            .delay(this.chipDelayFlyingTime)
            .call(() => {
                if (this.betItems?.winBetItems?.length > 0) {
                    this.handlePlaySound(CHIP_SOUND_ID.DIVIDE_CHIPS);
                }
                ActionChipFlying.dealerPayChips(this.dealerChipBox, this.betItems?.winBetItems, this);
            })
            .delay(this.chipDelayFlyingTime)
            .call(() => {
                this.payChipToAllPlayersNew();
            })
            .start();
    }

    getChipsByChoice(choice: string): Node[] {
        const preChoice = choice.replace("Live", "");
        const pre = this.chipStorage[preChoice] ?? [];
        const live = this.chipStorage[`${preChoice}Live`] ?? [];
        return [...pre, ...live];
    }

    payChipToAllPlayersNew() {
        const chipFlyingInfo: IChipFlyingInfo = {
            slidingChip: this.slidingChip,
            hiddenPlayersNode: this.hiddenPlayersNode,
            mainPlayerAvatarNode: this.mainPlayerAvatarNode,
            payChipsDuration: this.payChipsDuration,
        };

        const cloneSettlementStatus = { ...this.settlementStatus };

        ActionChipFlying.payChipsToMainPlayer(
            this.getSettlementStatus(cloneSettlementStatus),
            chipFlyingInfo,
            this.betItems?.winBetItems,
            this
        );
        this.showPayoutForMainPlayerNew();

        if (this.hiddenPlayersNode) {
            ActionChipFlying.payChipsToHiddenPlayers(this.hiddenPlayersNode, this.betItems?.winBetItems, this);
        }

        this.payChipsToAroundTablePlayers();
        this.startShowResultAnimation = false;
    }

    protected payChipsToAroundTablePlayers() {
        if (this.winningPlayers === null || Object.keys(this.winningPlayers).length === 0) {
            return;
        }
        this.handlePlaySound(CHIP_SOUND_ID.PAY_CHIPS);

        const winningPlayerIds = Object.keys(this.winningPlayers);
        const winningEffects: TWinningEffect[] = [];
        const balanceEffects: TBalanceEffect[] = [];

        winningPlayerIds.forEach((playerId) => {
            const aroundTablePlayerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(
                this.aroundTablePlayers?.aroundTablePlayerComponents,
                playerId
            );
            if (!aroundTablePlayerSlot) {
                return;
            }

            const winningPlayerData = this.winningPlayers[playerId];
            const playerBetItems = this.mergeWinningByChoices({ ...winningPlayerData.winningByChoices });

            const winBetItems = this.betItems.winBetItems ?? [];

            winBetItems?.forEach((item) => {
                const chipNodes = this.getChipsByChoice(item.betChoice);
                if (playerBetItems && playerBetItems[item.betChoice] > 0) {
                    this.moveChipsWithRandomAmount(chipNodes, aroundTablePlayerSlot.avatar.node, this.payChipsDuration);
                }
            });

            const { bet } = winningPlayerData;
            aroundTablePlayerSlot.increaseBalance(bet);
            winningEffects.push({ effectNode: aroundTablePlayerSlot.node, status: true });
            balanceEffects.push({ effectNode: aroundTablePlayerSlot.node, balance: bet });
        });

        this.aroundTablePlayersShowWinningEffect(winningEffects);
        this.updateAroundTablePlayersIncreaseBalance(balanceEffects);
    }

    showPayoutForMainPlayerNew() {
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

    handlePlaySound(id: string) {
        if (Object.keys(this.chipStorage).length > 0) {
            this.playSound(id);
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }

    payChipsWhenReceivingSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {}

    @render(
        ChipsPreviewStore,
        (store) => ({
            settlementResult: store.settlementResult,
            boundChipsFirstHalf: store.boundChipsFirstHalf,
            boundChipsSecondHalf: store.boundChipsSecondHalf,
        }),
        { fireImmediately: false }
    )
    payChipsInSettle(chipsSettlement: {
        settlementResult: gc.GameServiceMessage.TSettlementResult;
        boundChipsFirstHalf: boolean;
        boundChipsSecondHalf: boolean;
    }) {
        if (!this || !this.enablePlaceChips || !this.node || Object.keys(chipsSettlement.settlementResult).length === 0) {
            return;
        }

        if (this.node.activeInHierarchy) {
            this.startShowResultAnimation = true;
        }
        const { settlementResult } = chipsSettlement;

        this.payChips(settlementResult);
    }

    payChips(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        if (!this || !settlementResult || !this.enablePlaceChips || !this.node) {
            return;
        }

        const betItems = this.betChoicesContainer.getComponent(BetItems);
        this.updateBetState(this.chipContainer, betItems);
        this.betItems?.updateSettlementResult(settlementResult);
        if (!this.node.activeInHierarchy) {
            this.actionPayChips(false);
        } else {
            if (this.usingDelayPayChips) {
                tween(this.node)
                    .delay(this.delayAnimPayChips)
                    .call(() => this.actionPayChips(true))
                    .start();
            }
        }
    }

    private updateBetState(container: any, betItems: any = []) {
        this.betItems = betItems;
        this.inActiveAllChipContainers();
        this.currentChipContainer = container;
        container.active = true;
    }

    @render(Chips.ChipStore, (store) => store.clearAllChips, { fireImmediately: false })
    clearChipsForAllBetItems() {
        this.chipStorage = {};
        this.chipContainer.destroyAllChildren();
    }

    protected inActiveAllChipContainers() {
        this.chipContainer && (this.chipContainer.active = false);
    }

    override async flyChipsWhenJoinGame(chipsByMainPlayerRate: Record<string, any>) {}

    async bindChipsWhenJoinGame(chipsByMainPlayerRate: Record<string, any>, chipContainer: Node) {
        if (Object.keys(chipsByMainPlayerRate).length === 0) {
            return;
        }

        const betItemsByChoice = await this.betChoicesContainer.betItemsByChoice();
        chipContainer.active = true;

        for (const [key, value] of Object.entries(chipsByMainPlayerRate)) {
            const chipGroup = value;
            const chipBox = betItemsByChoice[key].chipBox;
            if (chipGroup && chipBox) {
                const nodes = addChipsToChipBoxWhenJoinRoom(chipContainer, betItemsByChoice[key].chipBox, chipGroup, this.slidingChip);
                this.addChipsToBoxWithChoice(nodes, key);
            }
        }
    }

    private mergeWinningByChoices(winningByChoices: Record<string, number> | null | undefined): Record<string, number> {
        const choices = winningByChoices ?? {};

        return Object.fromEntries(Object.keys(choices).map((key) => [key, (choices[key] || 0) || 0]));
    }

    protected getSettlementStatus(settlementStatus: gc.GameServiceMessage.Status) {
        const mergedWinningByChoices = this.mergeWinningByChoices(settlementStatus.winningByChoices);

        return {
            winningByChoices: mergedWinningByChoices ?? {},
            win: settlementStatus.win ?? false,
            bet: settlementStatus.bet ?? 0,
        } as gc.GameServiceMessage.Status;
    }
}
