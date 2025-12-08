import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import { sharedContainer } from "../../scripts/shared-container";
import * as MarbleFootball from "./features/feature";
import { MarbleRoundTimeStore } from "./features/rounds/marble-round-time-store";
import { MarbleRoundTimeHandlers } from "./features/rounds/marble-round-time-handler";
import { settings } from "./game-settings";
import { MarbleGameBetHandler } from "./features/bets/marble-game-bet-handler";

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings as any);
        container.bind(LogStore).to(LogStore);
        container.bind(MarbleRoundTimeStore).to(MarbleRoundTimeStore);
        container.bind(gc.Rounds.RoundTimeStore).toService(MarbleRoundTimeStore as any);
        container.bind(gc.Rounds.RoundTimeHandlers).toService(MarbleRoundTimeHandlers as any);
        container.bind(MarbleGameBetHandler).to(MarbleGameBetHandler);
        container.bind(gc.Bet.BetHandler).toService(MarbleGameBetHandler as any);
    },
    disabledFeatures: ["odds"],
    features: [MarbleFootball, gc.BetDetailsNew, ...gc.defaultFeatures],
};
