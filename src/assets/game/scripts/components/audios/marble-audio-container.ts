import gc from "@sg/game-client-base";
import { _decorator, game, log } from "cc";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import { FunctionUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { MarbleAudioStore } from "../../features/audios/marble-audio-store";
import CustomWebview from "../custom-webview/custom-webview";

const { Audios, UserSettings } = gc;
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class MarbleAudioContainer extends AudioContainer {
    @property(CustomWebview)
    customWebview: CustomWebview = null;

    protected isFirstLoad = true;
    protected maxWaitingTime = 5000;

    @render(MarbleAudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFXVoices(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id, false);
        }
    }

    override playMusic(data: gc.Audios.AudioData) {}

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable)
    async handleMusicEnable(musicEnable: boolean) {
        await this.handlePostMessage(["AudioStore", { userMuted: !musicEnable }]);
    }

    override initTouchBind() {
        const touchEvent = "ontouchend" in window ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];
        const [touchStartEvent, touchEndEvent] = touchEvent;

        const handleTouchEvent = async () => {
            if (!this.isFirstLoad) {
                return;
            }
            this.isUserGesture = true;
            this.postMessageUserGestureToParent();
            this.updateTouchedScreen();
            this.handlePostMessage(["AudioStore", { browserBlocked: false }]);
            this.isFirstLoad = false;
        };

        game.canvas.addEventListener(touchStartEvent, handleTouchEvent);
        game.canvas.addEventListener(touchEndEvent, handleTouchEvent);

        window.addEventListener("message", this.handleSoundEventFromParent);
    }

    async handlePostMessage<T extends Record<string, any>>(data: [string, T]) {
        if (!this.customWebview || !this.customWebview?.marbleTvReady) {
            await FunctionUtils.waitUntil(
                () => {
                    return this.customWebview && this.customWebview?.marbleTvReady;
                },
                100,
                this.maxWaitingTime
            );
        }
        log("handlePostMessage---------", data);
        this.customWebview?.postMessageToIframe(data);
    }
}
