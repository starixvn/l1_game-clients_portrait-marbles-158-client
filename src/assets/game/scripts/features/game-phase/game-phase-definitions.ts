import { settings } from "../../game-settings";

export interface GamePhase {
    id: string;
    visible?: boolean;
    progress?: number;
}

export interface GamePhaseConfig {
    id: string;
    begin: number;
    end: number;
    duration?: number;
}
export enum PhaseId {
    MatchWinner = "match-winner",
    MatchStatistics = "match-statistics",
    Halftime = "halftime",
    Settlement = "settlement",
    ShowIntroVideo = "show-intro-video",
    ShowPrevVideo = "show-prev-video",
    ShowLiveVideo = "show-live-video",
    ShowBetChoicesLive = "show-bet-choices-live",
    ShowBetChoicesPrev = "show-bet-choices-prev",
    showGameBackground = "show-game-background",
    AutoHidePreviewBetChoicesLive = "auto-hide-preview-bet-choices-live",
    AutoHidePreviewBetChoicesPrev = "auto-hide-preview-bet-choices-prev",
}

export const TimePointShowMatchWinner = settings.durations.matchWinner;
export const TimePointHalftime = settings.points.streamingFirstHalfVideo - settings.durations.videoDuration;
