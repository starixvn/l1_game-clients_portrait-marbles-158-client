import inversify from "inversify";
import gc from "@sg/game-client-base";

const { injectable, inject } = inversify;

type UltraliveFinishMessage = {
    result: gc.GameServiceMessage.TResult;
    settlementResult: Array<gc.GameServiceMessage.TSettlementResult>;
    roundId: number;
} & gc.GameServiceMessage.Finish;

@injectable()
export class SettlementHandlers extends gc.Settlements.SettlementHandlers {
    constructor(
        @inject(gc.Settlements.SettlementStore) protected readonly settlementStore: gc.Settlements.SettlementStore,
        @inject(gc.Settlements.SettlementStatusStore) protected readonly statusStore: gc.Settlements.SettlementStatusStore,
        @inject(gc.Notices.NoticeStore) protected readonly noticeStore: gc.Notices.NoticeStore
    ) {
        super(settlementStore, statusStore, noticeStore);
    }

    handleFinish(finish: UltraliveFinishMessage) {
        const settlementResult = finish.settlementResult[finish.settlementResult.length - 1];

        this.settlementStore.setSettlementStore({
            ...finish,
            settlementResult: settlementResult,
        });
    }

    handleStatus(status: gc.GameServiceMessage.Status) {
        this.statusStore.setStatusStore(status);
    }

    handleWinners(winners: gc.GameServiceMessage.Winners) {
        this.settlementStore.winningPlayers = winners.winningPlayers;
    }

    handleReachMaxWin() {
        this.noticeStore.addWarning(gc.Translator.commonTranslate("you_reach_max_win"));
    }

    eventHandleList = [
        {
            name: gc.GameServiceMessage.Finish.eventName,
            handle: this.handleFinish,
        },
        {
            name: gc.GameServiceMessage.Status.eventName,
            handle: this.handleStatus,
        },
        {
            name: gc.GameServiceMessage.Winners.eventName,
            handle: this.handleWinners,
        },
    ];
}
