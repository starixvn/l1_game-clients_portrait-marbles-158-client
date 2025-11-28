import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import { sharedContainer } from "../../scripts/shared-container";
import * as MarbleFootball from "./features/feature";
import { MarbleRoundTimeStore } from "./features/rounds/marble-round-time-store";
import { MarbleRoundTimeHandlers } from "./features/rounds/marble-round-time-handler";
import { UltraLiveSettlementHandlers } from "./features/ultra-live-settlement/ultra-live-settlement-handler";
import { MarbleRoundRunningHandler } from "./features/rounds/marble-round-running-handler";
import { settings } from "./game-settings";

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings as any);
        container.bind(LogStore).to(LogStore);
        container.bind(MarbleRoundTimeStore).to(MarbleRoundTimeStore);
        container.bind(gc.Rounds.RoundTimeStore).toService(MarbleRoundTimeStore as any);
        container.bind(gc.Rounds.RoundTimeHandlers).toService(MarbleRoundTimeHandlers as any);
        container.bind(gc.Rounds.RoundRunningHandlers).toService(MarbleRoundRunningHandler as any);
        container.bind(gc.Settlements.SettlementHandlers).toService(UltraLiveSettlementHandlers);
    },
    disabledFeatures: ["odds"],
    features: [MarbleFootball, gc.BetDetailsNew, ...gc.defaultFeatures],
};
