export const GAME_NAME = "Marbles158";

export const settings = {
    id: 158,
    name: GAME_NAME,
    observerNamespace: GAME_NAME,
    namespaces: [GAME_NAME],
    hedgeBetGroups: [
        ["home", "away"],
        ["awayLive", "homeLive"],
    ],
    numberOfRoundHistory: 100,
    durationShowPromptMessage: 1,
};
