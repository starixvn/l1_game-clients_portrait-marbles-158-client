import mobx from "mobx";
import inversify from "inversify";
const { injectable, inject } = inversify;
import gc from "@sg/game-client-base";
import { MarbleGameSetting } from "../game-configs/marble-game-setting";

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
}
