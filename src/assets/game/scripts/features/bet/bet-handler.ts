import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MarbleBetStore } from "./bet-store";
const { injectable, inject } = inversify;

@injectable()
export class BetHandler extends gc.Bet.BetHandler {
    @inject(MarbleBetStore) protected readonly marbleBetStore: MarbleBetStore;
    constructor(
        @inject(gc.Connection.ConnectionStore) protected readonly connectionStore: gc.Connection.ConnectionStore,
        @inject(gc.Bet.BetStore) protected readonly betStore: gc.Bet.BetStore,
        @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore,
        @inject(gc.Orientation.OrientationStore) protected readonly orientationStore: gc.Orientation.OrientationStore,
        @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore,
        @inject(gc.Notices.NoticeStore) protected readonly noticeStore: gc.Notices.NoticeStore,
        @inject(gc.Connection.ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: gc.Connection.ConnectionHandlers.RetryGameHandler,
        @inject(gc.GameConfigs.GameSetting) protected readonly gameSetting: gc.GameConfigs.GameSetting,
    ) {
        super(connectionStore, betStore, mainPlayerStore, orientationStore, roundTimeStore, noticeStore, retryGameHandler, gameSetting);
    }
    
    public override isInPhasePreventBet(): boolean {
        return !this.marbleBetStore.allowBet;
    }
}