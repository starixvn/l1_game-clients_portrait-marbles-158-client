import { log, view } from "cc";
import { TOP_OFFSET_DEFAULT } from "../game/scripts/components/video/video-offset-container";
export class DOMBackgroundVideo {
    static readonly GAME_CONTAINER_ID = "Cocos3dGameContainer";
    static readonly GAME_CANVAS_ID = "GameCanvas";

    static readonly VIDEO_ID = "VideoBackground";

    static resizeObserver: ResizeObserver = new ResizeObserver(() => {
        DOMBackgroundVideo.onResize();
    });

    static maxHeight = 466;

    static setMaxHeight(height: number) {
        this.maxHeight = height;
    }

    static createOrLoadVideoElement(): HTMLVideoElement {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);
        const game = document.getElementById(DOMBackgroundVideo.GAME_CANVAS_ID);
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;

        if (game) {
            DOMBackgroundVideo.applyGameStyles(game);
        }

        if (!video) {
            const video = document.createElement("video");
            const size = container.getBoundingClientRect();

            video.id = DOMBackgroundVideo.VIDEO_ID;
            video.muted = true;
            DOMBackgroundVideo.applyVideoStyles(video, size);

            container.insertBefore(video, container.firstChild);

            DOMBackgroundVideo.registerEvents();

            return video;
        }

        return video;
    }

    static removeVideoElement() {
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;

        if (video) {
            DOMBackgroundVideo.unregisterEvents();
            video.remove();
        }
    }

    private static applyVideoStyles(video: HTMLVideoElement, size: DOMRect) {
        // Calculate video dimensions in pixels
        const { width, height } = this.getVideoDimensions(size.width);

        // Apply styles
        video.style.visibility = "visible";
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "50%";
        video.style.transform = "translateX(-50%)";
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.zIndex = "10";

        // Set video element attributes
        video.width = width;
        video.height = height;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";
    }

    static updateVideoPosition(offsetTop = 0) {
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;
        if (!video) {
            log("video not found----------");
            return;
        }

        if (offsetTop <= TOP_OFFSET_DEFAULT) {
            video.style.top = `${TOP_OFFSET_DEFAULT}px`;

            return;
        }

        const width = view.getVisibleSize()?.width;
        const topOffsetVW = Number(((offsetTop / width) * 100).toFixed(2));
        video.style.top = `${topOffsetVW}vw`;
    }

    static updateVideoDimension(value: { width: number; height: number; top: number }) {
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;
        if (!video) {
            log("video not found----------");
            return;
        }

        const { width: widthVideo, height: heightVideo } = this.getVideoDimensions(value?.width, value?.height);

        video.style.width = `${widthVideo}px`;
        video.style.height = `${heightVideo}px`;
        video.width = widthVideo;
        video.height = heightVideo;

        this.updateVideoPosition(value?.top);
    }

    static getVideoDimensions(currentWidth: number, currentHeight?: number) {
        const ratio = view.getVisibleSize()?.width / DOMBackgroundVideo.maxHeight;
        const width = Math.min(currentWidth, view.getDesignResolutionSize()?.width);

        console.log("width", width, ratio);
        const height = currentHeight ? currentHeight : width / ratio;

        return {
            width: Math.round(width),
            height: Math.round(height),
        };
    }

    private static applyGameStyles(game: HTMLElement) {
        game.style.zIndex = "11";
        game.style.position = "relative";
    }

    private static onResize() {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);
        const size = container.getBoundingClientRect();
        const video = DOMBackgroundVideo.createOrLoadVideoElement();

        DOMBackgroundVideo.applyVideoStyles(video, size);
    }

    private static registerEvents() {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);

        DOMBackgroundVideo.resizeObserver.observe(container);
    }

    private static unregisterEvents() {
        DOMBackgroundVideo.resizeObserver.disconnect();
    }
}
