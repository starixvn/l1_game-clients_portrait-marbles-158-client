import { _decorator, Component } from "cc";
import Hls from "hls.js";
import { SYNC_VIDEO_DIMENSION_EVENT, VideoOffSetContainer } from "../game/scripts/components/video/video-offset-container";
import { DOMBackgroundVideo } from "./dom-background-video";

const { ccclass, property } = _decorator;

const MAX_HEIGHT_PORTRAIT = 424;
const MAX_HEIGHT_DIRECT = 466;

@ccclass("BackgroundVideoPlayer")
export class BackgroundVideoPlayer extends Component {
    @property(VideoOffSetContainer)
    videoOffSetContainer: VideoOffSetContainer = null;

    @property
    isPortrait = false;

    private hls: Hls = null;
    private native: HTMLVideoElement = null;

    private _videoSource = "";
    private _videoName = "";
    private liveStreamServer = "";
    private _muted = true;
    private _videoDimension = {
        width: 0,
        height: 0,
        top: 0,
    };

    private _onPlayStateChanged: (isPlay: boolean) => void = null;

    private get initialized() {
        return !!this.native && !!this.hls;
    }

    currentTime = 0;

    init(liveStreamServer: string, callbackAfterPlay: (isPlay: boolean) => void) {
        this.liveStreamServer = liveStreamServer;
        this._onPlayStateChanged = callbackAfterPlay;
    }

    loadVideoByName(videoName: string): boolean {
        if (!videoName?.trim() || !this.liveStreamServer) {
            return false;
        }

        if (this._videoName !== videoName || !this.initialized) {
            this._videoName = videoName;
            this._videoSource = new URL(`${videoName.trim()}.m3u8`, this.liveStreamServer).toString();
            this.loadSource();
            this._onPlayStateChanged(false);
        }

        return true;
    }

    playVideoByName(videoName: string, callback: (isPlay: boolean) => void) {
        if (this.loadVideoByName(videoName)) {
            this.play();
        }
    }

    resetAllSettings() {
        this._videoSource = "";
        this._videoName = "";
    }

    get bandwidthEstimate() {
        return this.hls?.bandwidthEstimate ?? 0;
    }

    setNativeMuted() {
        if (this.native) {
            this.native.muted = this._muted;
        }
    }

    loadSource() {
        if (!this.initialized) {
            this.initialize();
        }
        this.hls.loadSource(this._videoSource);
        this.pause();
    }

    play(retry = 0, maxRetry = 3) {
        // Fix for iOS 17, video element is not playing immediately
        this.native
            .play()
            .then(() => {
                this._onPlayStateChanged(true);
            })
            .catch(() => {
                if (retry < maxRetry) {
                    this.play(retry + 1, maxRetry);
                }
            });
    }

    pause() {
        if (this.initialized) {
            this.native.pause();
        }
    }

    set muted(value: boolean) {
        this._muted = value;
    }

    get level() {
        return this.hls?.currentLevel ?? 0;
    }

    protected lateUpdate(dt: number): void {
        this.currentTime += dt;
    }

    onLoad() {
        this.videoOffSetContainer.node.on(SYNC_VIDEO_DIMENSION_EVENT, this.updateVideoDimension, this);

        this.initialize();
    }

    protected onDestroy(): void {
        this.stop();
    }

    stop() {
        if (this.initialized) {
            this.native.removeEventListener("timeupdate", this.syncCurrentTime.bind(this));

            this.hls.off(Hls.Events.ERROR);
            this.hls.detachMedia();
            this.hls.destroy();
        }
    }

    private updateVideoDimension(value: { width: number; height: number; top: number }) {
        this._videoDimension = value;
        value?.top > 0 && DOMBackgroundVideo.updateVideoDimension(value);
    }

    private syncCurrentTime() {
        this.node.emit("syncNativeCurrentTime", this.native.currentTime);

        const needSync = this.currentTime >= 0 && Math.abs(this.currentTime - this.native.currentTime) > 1;

        if (this.initialized && needSync) {
            this.native.currentTime = this.currentTime;
        }
    }

    private initialize() {
        DOMBackgroundVideo.setMaxHeight(this.isPortrait ? MAX_HEIGHT_PORTRAIT : MAX_HEIGHT_DIRECT);
        const video = DOMBackgroundVideo.createOrLoadVideoElement();

        if (!Hls.isSupported()) {
            this.node.emit("hlsNotSupported");
            throw new Error("Hls.js is not supported.");
        }

        const hls = new Hls({
            startLevel: -1,
            capLevelToPlayerSize: true,
            lowLatencyMode: true,
            liveSyncDuration: 0.9,
            liveMaxLatencyDuration: 1,
            // maxBufferSize: 2 * 1000_000, // MB
            // maxBufferLength: 1, // in seconds
            // maxMaxBufferLength: 3, // in seconds
        });

        video.addEventListener("timeupdate", this.syncCurrentTime.bind(this));
        hls.attachMedia(video);

        hls.on(Hls.Events.LEVEL_SWITCHED, this.node.emit.bind(this.node));
        hls.on(Hls.Events.MANIFEST_LOADING, this.node.emit.bind(this.node));
        hls.on(Hls.Events.MANIFEST_PARSED, this.node.emit.bind(this.node));
        hls.on(Hls.Events.FRAG_BUFFERED, this.node.emit.bind(this.node));
        hls.on(Hls.Events.FRAG_CHANGED, this.node.emit.bind(this.node));

        hls.on(Hls.Events.ERROR, (event, data) => {
            this.node.emit(event, {
                ...data,
                video: this._videoName,
                server: this.liveStreamServer,
                bandwidth: this.bandwidthEstimate,
            });
            this.syncCurrentTime();
        });

        this.hls = hls;
        this.native = video;

        this._videoDimension?.top > 0 && DOMBackgroundVideo.updateVideoDimension(this._videoDimension);
    }
}
