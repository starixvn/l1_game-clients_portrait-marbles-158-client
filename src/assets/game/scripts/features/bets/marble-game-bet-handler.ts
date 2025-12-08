import gc from "@sg/game-client-base";

import inversify from "inversify";
import { OddsStore } from "../dynamic-odds/odds-store";

const { injectable, inject } = inversify;
const { Rounds, Translator } = gc;

@injectable()
export class MarbleGameBetHandler extends gc.Bet.BetHandler {
    @inject(OddsStore) protected readonly oddsStore: OddsStore;

    isInPhasePreventBet() {
        const isPreventBet = this.roundTimeStore.roundState !== Rounds.ROUND_STATE.PLACING_BET;

        if (isPreventBet) {
            const warningMsg = this.getWarningMessage(
                this.roundTimeStore.roundState,
                this.roundTimeStore.isStartingRound,
                this.oddsStore.isFinalBlock
            );
            this.noticeStore.addWarning(warningMsg);
        }

        return isPreventBet;
    }

    private getWarningMessage(roundState: string, isStartingRound: boolean, isFinalBlock: boolean) {
        if (isStartingRound) {
            return Translator.commonTranslate("message_cannot_bet");
        }

        if (roundState === Rounds.ROUND_STATE.LOCKING_BET && !isFinalBlock) {
            return Translator.gameTranslate("message_placebet_odds_update");
        }

        return Translator.commonTranslate("message_placebet_next_round");
    }
}
