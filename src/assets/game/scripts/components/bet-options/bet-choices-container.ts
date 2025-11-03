import gc from "@sg/game-client-base";
import { Node, _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { OddsStore, OddsWithConfig } from "../../features/dynamic-odds/odds-store";
import { BetItems } from "./bet-items";
import BetItem from "../../../../../extensions/shared-components/assets/game/bets/scripts/components/bet-item";
const { ccclass, property } = _decorator;

const { Rounds } = gc;
const { render } = Observer;


@ccclass
export class BetChoicesContainer extends ObserverComponent {
    @property(Node)
    betChoices: Node = null;

    @property(Node)
    chipContainer: Node = null;

    protected betItems: BetItems = null;
    protected betChoicesInMatch = [];

    private _odds: OddsWithConfig = null;
    private _totalBets: Record<string, number> = {};
    private _ownBets: Record<string, number> = {};
    private _userPercentage: Record<string, number> = {};

    private initializeBetItems(): void {
        this.betItems = this.betChoices?.getComponent(BetItems);
        this.betChoicesInMatch = [this.betItems];
    }

    onLoad(): void {
        this.initializeBetItems();
        super.onLoad();
    }

    protected start(): void {
        this.handleAfterActiveBetItems(this.betItems, false, () => {
            this.betChoices.active = true;
            this.chipContainer.active = true;
        });
    }

    @render(OddsStore, (store) => store.oddsWithConfig)
    renderOdds(oddsWithConfig: OddsWithConfig) {
        this._odds = oddsWithConfig;
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        this._totalBets = totalBets;
    }

    @render(Rounds.RoundStore, (store) => store.ownBets)
    renderOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        this._ownBets = ownBets;
    }

    @render(Rounds.RoundStore, (store) => store.userBetPercentage)
    renderUserBetPercentage(userBetPercentage: gc.GameServiceMessage.UserBetPercentage) {
        this._userPercentage = userBetPercentage;
    }

    async betItemsByChoice() {
        const betItemsByChoice: Record<string, BetItem> = {};
        const betItems = this.betChoices?.getComponent(BetItems)?.getComponentsInChildren(BetItem);

        for (const betItem of betItems || []) {
            betItem.betChoice && (betItemsByChoice[betItem.betChoice] = betItem);
        }
        return betItemsByChoice;
    }

    private handleAfterActiveBetItems(betItems: BetItems, bindFlag: boolean, triggerMethod: () => void) {
        if (betItems.betItemComponents.length === 0) {
            this.scheduleOnce(() => {
                this.handleAfterActiveBetItems(betItems, bindFlag, triggerMethod);
            }, 0.1);
            return;
        }
        if (!bindFlag) {
            betItems?.renderTotalBets(this._totalBets);
            betItems?.renderOwnBets(this._ownBets);
            betItems?.handleUserBetPercentage(this._userPercentage);
            betItems?.renderOdds(this._odds);
        }
        triggerMethod();
    }
}
