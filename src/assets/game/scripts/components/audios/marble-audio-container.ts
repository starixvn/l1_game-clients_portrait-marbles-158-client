import gc from "@sg/game-client-base";
import { _decorator, game } from "cc";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import Observer from "observer";
import { MarbleAudioStore } from "../../features/audios/marble-audio-store";
import { PlaylistStore } from "../../features/playlist/playlist-store";

const { Audios } = gc;
const { ccclass } = _decorator;
const { render } = Observer;

@ccclass
export class MarbleAudioContainer extends AudioContainer {
    protected currentPlaylist = "";
    @render(MarbleAudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFXVoices(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id, false);
        }
    }

    override playMusic(data: gc.Audios.AudioData) {}

    override enableMusic(musicEnable: boolean) {
        super.enableMusic(musicEnable);
        this.handlePostMessageToPlaylist({ userMuted: musicEnable });
    }

    @render(PlaylistStore, (store) => store.playlist)
    renderLinkPlay(playlist: string) {
        if (!playlist) {
            return;
        }
        this.currentPlaylist = playlist;
    }

    override initTouchBind() {
        const touchEvent = "ontouchend" in window ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];
        const [touchStartEvent, touchEndEvent] = touchEvent;

        const handleTouchEvent = () => {
            this.isUserGesture = true;
            this.postMessageUserGestureToParent();
            this.updateTouchedScreen();
            this.handlePostMessageToPlaylist({ browserBlocked: false });
        };

        game.canvas.addEventListener(touchStartEvent, handleTouchEvent);
        game.canvas.addEventListener(touchEndEvent, handleTouchEvent);

        window.addEventListener("message", this.handleSoundEventFromParent);
    }

    handlePostMessageToPlaylist(value: any) {
        window.postMessage(["AudioStore", { value }], this.currentPlaylist);
    }
}
