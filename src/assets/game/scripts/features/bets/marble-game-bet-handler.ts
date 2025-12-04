import gc from "@sg/game-client-base";

import inversify from "inversify";
import { OddsStore } from "../dynamic-odds/odds-store";

const { injectable, inject } = inversify;
const { Rounds, Translator } = gc;

@injectable()
export class MarbleGameBetHandler extends gc.Bet.BetHandler {
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;
    @inject(gc.Notices.NoticeStore) protected readonly noticeStore: gc.Notices.NoticeStore;
    @inject(OddsStore) protected readonly oddsStore: OddsStore;

    isInPhasePreventBet() {
        const isPreventBet = this.roundTimeStore.roundState !== Rounds.ROUND_STATE.PLACING_BET;

        if (isPreventBet) {
            let warningMsg = "";
            const isStartingRound = this.roundTimeStore.isStartingRound;
            if (isStartingRound) {
                warningMsg = Translator.commonTranslate("message_cannot_bet");
            } else if (this.roundTimeStore.showingResult) {
                warningMsg = Translator.commonTranslate("message_placebet_next_round");
            } else {
                warningMsg = Translator.gameTranslate("message_placebet_odds_update");
            }

            this.noticeStore.addWarning(warningMsg);
        }

        return isPreventBet;
    }
}
