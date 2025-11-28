import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable, inject } = inversify;

type UltraLiveFinishMessage = {
    result: Record<number, gc.GameServiceMessage.TResult>;
    settlementResult: Record<number, gc.GameServiceMessage.TSettlementResult>;
    roundId: number;
} & gc.GameServiceMessage.Finish;

@injectable()
export class UltraLiveSettlementHandlers extends gc.Settlements.SettlementHandlers {
    constructor(
        @inject(gc.Settlements.SettlementStore) protected readonly settlementStore: gc.Settlements.SettlementStore,
        @inject(gc.Settlements.SettlementStatusStore) protected readonly statusStore: gc.Settlements.SettlementStatusStore,
        @inject(gc.Notices.NoticeStore) protected readonly noticeStore: gc.Notices.NoticeStore
    ) {
        super(settlementStore, statusStore, noticeStore);
    }

    override handleFinish(finish: UltraLiveFinishMessage) {
        const lastIndex = Number(Object.keys(finish.settlementResult).pop());
        const lastIndexSettlementResult = finish.settlementResult[lastIndex];
        const finishResult = {
            ...finish,
            settlementResult: lastIndexSettlementResult,
        };

        this.settlementStore.setSettlementStore(finishResult);
    }

    override eventHandleList = [
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
