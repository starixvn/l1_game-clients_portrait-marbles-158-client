import gc from "@sg/game-client-base";
import { _decorator, game } from "cc";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import Observer from "observer";
import { MarbleAudioStore } from "../../features/audios/marble-audio-store";
import CustomWebview from "../custom-webview/custom-webview";

const { Audios } = gc;
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class MarbleAudioContainer extends AudioContainer {
    @property(CustomWebview)
    customWebview: CustomWebview = null;

    @render(MarbleAudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFXVoices(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id, false);
        }
    }

    override playMusic(data: gc.Audios.AudioData) {}

    override enableMusic(musicEnable: boolean) {
        super.enableMusic(musicEnable);
        this.customWebview?.postMessageToIframe(["AudioStore", { userMuted: !musicEnable }]);
    }

    override initTouchBind() {
        const touchEvent = "ontouchend" in window ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];
        const [touchStartEvent, touchEndEvent] = touchEvent;

        const handleTouchEvent = () => {
            this.isUserGesture = true;
            this.postMessageUserGestureToParent();
            this.updateTouchedScreen();
            this.customWebview?.postMessageToIframe(["AudioStore", { browserBlocked: false }]);
        };

        game.canvas.addEventListener(touchStartEvent, handleTouchEvent);
        game.canvas.addEventListener(touchEndEvent, handleTouchEvent);

        window.addEventListener("message", this.handleSoundEventFromParent);
    }
}
