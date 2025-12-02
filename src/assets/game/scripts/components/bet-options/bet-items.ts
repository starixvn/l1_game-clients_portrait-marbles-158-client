import gc from "@sg/game-client-base";
import { _decorator, Widget } from "cc";
import { BetItemsPolygon as BetItemsPolygonBase } from "db://shared-components/game/bets/scripts/components/bet-items-polygon";
import observer from "observer";
import { OddsStore, OddsWithConfig } from "../../features/dynamic-odds/odds-store";
import { MarbleRoundTimeStore } from "../../features/rounds/marble-round-time-store";
import BetItemCustomize from "./bet-item-customize";

const { ccclass } = _decorator;
const { render } = observer;

const { RoundHistories } = gc;

@ccclass
export class BetItems extends BetItemsPolygonBase {
    @render(OddsStore, (store) => store.oddsWithConfig)
    renderOdds(oddsWithConfig: OddsWithConfig) {
        const { odds, fractional } = oddsWithConfig;

        Object.keys(odds || {}).forEach((choice) => {
            const betItem = this.filterBetItem(choice) as BetItemCustomize;
            if (!betItem) {
                return;
            }

            const odd = odds[choice];
            if (odd <= 0) {
                betItem.blockBetOption();
                return;
            }

            betItem.renderOdd(odd, fractional);
            this.updateWidgets(betItem);
        });
    }

    updateWidgets(betItem: BetItemCustomize) {
        const widgets = betItem.lblOdds?.getComponentsInChildren(Widget);
        if (widgets.length > 0) {
            widgets.forEach((widget) => {
                widget.updateAlignment();
            });
        }
    }

    @render(gc.Rounds.RoundStore, (store) => store.userBetPercentage)
    handleUserBetPercentage(userBetPercentage: gc.GameServiceMessage.UserBetPercentage) {
        this.betItemComponents?.forEach((betItem) => {
            const choice = betItem?.node?.name;
            betItem?.renderUserBetPercentage(userBetPercentage?.[choice] ?? 0);
        });
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    override renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }
        const { roundHistory, staticHighlight, animationHighlight } = firstJoinGameHistory;
        roundHistory && this.setHighlightStatic(staticHighlight, animationHighlight, roundHistory);
    }

    override setHighlightStatic(staticHighlight: boolean, animationHighlight: boolean, roundHistory: gc.RoundHistories.RoundHistory) {
        if (staticHighlight || animationHighlight) {
            const settlementResult = roundHistory?.settlementResult as unknown as Record<number, gc.GameServiceMessage.TSettlementResult>;
            if (settlementResult) {
                const values = Object.values(settlementResult);
                if (!values.length) {
                    return;
                }
                const value = values[values.length - 1];
                if (value) {
                    this.settlementResult = value;
                    this.showHighlightStatic(value);
                }
            }
        }
    }

    @render(MarbleRoundTimeStore, (store) => store.isPlacingBet)
    handleRoundState(isPlacingBet: boolean) {
        if (isPlacingBet && this.settlementResult) {
            this.showHighlightStatic(this.settlementResult);
        }
    }
}
