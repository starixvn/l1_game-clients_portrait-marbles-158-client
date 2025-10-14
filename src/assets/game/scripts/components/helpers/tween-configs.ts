import { Vec3, v3 } from "cc";

export interface TweenConfig {
    scale?: Vec3;
    position?: Vec3;
    opacity?: number;
    positionY?: number;
    time: number;
}

export interface TweenConfigs {
    in: TweenConfig;
    out?: TweenConfig;
}

export type TweenKey =
    | "fadeInOut"
    | "betChoiceZoomInOut"
    | "hiddenPlayersFlyUpBet"
    | "hiddenPlayersWhenLive"
    | "swapButtonWhenBet"
    | "swapButtonWhenLive"
    | "betChoiceSettlement"
    | "scoreBoardInOut";

export const DURATION_ANIM_IN = 0.5;
export const DURATION_ANIM_OUT = 0.7;

export const DEFAULT_TWEEN_CONFIGS: Record<TweenKey, TweenConfigs> = {
    betChoiceZoomInOut: {
        in: { position: v3(0, -70, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -364, 0), time: DURATION_ANIM_OUT },
    },
    betChoiceSettlement: {
        in: { position: v3(0, -333, 0), time: DURATION_ANIM_IN },
    },
    fadeInOut: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUpBet: {
        in: { positionY: -362, opacity: 255, time: 0 },
    },
    hiddenPlayersWhenLive: {
        in: { positionY: -82, opacity: 255, time: 0 },
    },
    swapButtonWhenBet: {
        in: { positionY: -294, opacity: 255, time: 0 },
    },
    swapButtonWhenLive: {
        in: { positionY: 257, opacity: 255, time: 0 },
    },
    scoreBoardInOut: { in: { time: 0 }, out: { time: 0 } },
};

export const DEFAULT_TWEEN_CONFIGS_PORTRAIT: Record<TweenKey, TweenConfigs> = {
    betChoiceZoomInOut: {
        in: { position: v3(0, -200, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -200, 0), time: DURATION_ANIM_OUT },
    },
    betChoiceSettlement: {
        in: { position: v3(0, -191, 0), time: DURATION_ANIM_IN },
        out: { time: DURATION_ANIM_OUT },
    },
    fadeInOut: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersWhenLive: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_IN },
    },
    swapButtonWhenBet: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
    },
    swapButtonWhenLive: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
    },
    hiddenPlayersFlyUpBet: {
        in: { time: 0, opacity: 255 },
    },
    scoreBoardInOut: {
        in: { positionY: -640, time: DURATION_ANIM_IN },
        out: { time: DURATION_ANIM_IN },
    },
};
