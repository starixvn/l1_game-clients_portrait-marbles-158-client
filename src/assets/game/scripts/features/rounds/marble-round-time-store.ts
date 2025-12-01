import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { MarbleGameSetting } from "../game-configs/marble-game-setting";
const { injectable, inject } = inversify;

export const MARBLE_ROUND_STATE = {
    START_GAME_LOOP: "startGameLoop",
    STARTING_ROUND: "startingRound",
    PLACING_BET: "placingBet",
    LOCKING_BET: "lockingBet",
    WAITING: "waiting",
    SHOW_ANIMATION_RESULT: "showAnimationResult",
    SHOW_RESULT: "showResult",
    CHANGE_REMAINING_TIME: "changeRemainingTime",
    STOP_GAME_LOOP: "stopGameLoop",
    PLAYING_VIDEO: "playingVideo",
    HALF_TIME: "halfTime",
    INTRO_VIDEO: "introVideo",
    NONE: "none",
};

@injectable()
export class MarbleRoundTimeStore {
    @inject(gc.GameConfigs.GameSetting) readonly gameSetting: MarbleGameSetting;

    private _roundState = MARBLE_ROUND_STATE.NONE;
    private _roundTime = 0;

    startPlacingBet = false;
    endPlacingBet = false;
    startNewRound = false;
    endRound = false;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get roundState() {
        return this._roundState;
    }

    set roundState(value: string) {
        this._roundState = value;
    }

    get isPlacingBet() {
        return this.startPlacingBet;
    }

    get isShowAnimationResult() {
        return this.roundState === MARBLE_ROUND_STATE.SHOW_ANIMATION_RESULT;
    }

    get isShowResult() {
        return this.roundState === MARBLE_ROUND_STATE.SHOW_RESULT;
    }

    get isStartingRound() {
        return this.roundState === MARBLE_ROUND_STATE.STARTING_ROUND;
    }

    get isShowDisabledGameMessage() {
        return this.endRound || this.roundState === MARBLE_ROUND_STATE.NONE;
    }

    get isDisplayingResultState() {
        return (
            this.roundState === MARBLE_ROUND_STATE.SHOW_ANIMATION_RESULT ||
            this.roundState === MARBLE_ROUND_STATE.SHOW_RESULT ||
            this.roundState === MARBLE_ROUND_STATE.STOP_GAME_LOOP
        );
    }

    get roundTime() {
        return this._roundTime;
    }

    set roundTime(roundTime) {
        this._roundTime = roundTime;
    }

    start() {
        this.roundState = MARBLE_ROUND_STATE.START_GAME_LOOP;
    }

    resetRoundTimeStore() {}

    resetRoundTime() {}

    countdown() {}
}
