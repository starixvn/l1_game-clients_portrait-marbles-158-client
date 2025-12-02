import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable } = inversify;

@injectable()
export class MarbleRoundHistoriesHandler extends gc.RoundHistories.RoundHistoryHandlers {
    override handleRoundHistory(roundHistories: gc.RoundHistories.RoundHistory[]): void {
        const processedRoundHistories = roundHistories.map((roundHistory) => {
            const settlementResult = roundHistory.settlementResult as unknown as gc.GameServiceMessage.TSettlementResult[];

            const lastIndex = Number(Object.keys(settlementResult).pop());

            return {
                ...roundHistory,
                settlementResult: settlementResult[lastIndex],
            };
        });

        super.handleRoundHistory(processedRoundHistories);
    }
}
