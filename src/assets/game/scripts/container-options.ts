import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import { sharedContainer } from "../../scripts/shared-container";
import * as MarbleFootball from "./features/feature";
import { settings } from "./game-settings";
import { MarbleRoundTimeStore } from "./features/rounds/marble-round-time-store";
import { BetHandler } from "./features/bet/bet-handler";
import { MarbleBetStore } from "./features/bet/bet-store";
import { SettlementHandlers } from "./features/ultralive-settlement/ultralive-settlement-handler";

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings as any);
        container.bind(LogStore).to(LogStore);
        container.bind(MarbleRoundTimeStore).to(MarbleRoundTimeStore);
        container.bind(gc.Rounds.RoundTimeStore).toService(MarbleRoundTimeStore as any);
        container.bind(MarbleBetStore).to(MarbleBetStore);
        container.bind(gc.Bet.BetHandler).toService(BetHandler as any);
        container.bind(gc.Settlements.SettlementHandlers).toService(SettlementHandlers);
        
    },
    disabledFeatures: ["odds"],
    features: [MarbleFootball, gc.BetDetailsNew, ...gc.defaultFeatures],
};
