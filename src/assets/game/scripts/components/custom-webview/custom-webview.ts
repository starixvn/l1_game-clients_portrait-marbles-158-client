import gc from "@sg/game-client-base";
import { _decorator, CCInteger, CCString, log, WebView } from "cc";
import { InGameMenuEvents } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-store";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { PlaylistStore } from "../../features/playlist/playlist-store";
const { ccclass, property } = _decorator;
const { render } = Observer;

export const LOCALE_MAPPING = {
    en: "en-US",
    id: "id-ID",
    th: "th-TH",
    vi: "vi-VN",
    zh_cn: "zh-CN",
    zh_tw: "zh-TW",
    ja: "ja-JP",
    es: "es-ES",
    tr: "tr-TR",
    fil_ph: "fil-PH",
    pt_br: "pt-BR",
    ko: "ko-KR",
    bn_bd: "bn-BD",
    hi_in: "hi-IN",
    ms_my: "ms-MY",
};

@ccclass
export default class CustomWebview extends ObserverComponent {
    @property(WebView)
    webview: WebView = null;

    @property(CCString)
    wrapperId = "custom-webview-wrapper";

    @property(CCInteger)
    zIndex = -1;

    protected currentPlaylist = "";
    protected parentElement: any = null;
    protected webviewId = `${this.wrapperId}-webview`;
    marbleTvReady = false;

    onLoad() {
        log("webview loaded");
        super.onLoad();
        this.scheduleOnce(() => {
            this.modifyWebViewWrapper();
        }, 0.1);

        window.addEventListener("message", this.handleSoundEventFromParent.bind(this));
    }

    handleSoundEventFromParent(event: MessageEvent) {
        const { marbleTvReady } = event.data;
        if (marbleTvReady !== null && marbleTvReady !== undefined) {
            this.marbleTvReady = marbleTvReady;
        }
    }

    modifyWebViewWrapper() {
        const impl = (this.webview as any)._impl;
        if (!impl?._webview?.parentElement) {
            console.warn("WebView not ready.");
            return;
        }

        this.parentElement = impl._webview.parentElement;
        this.parentElement.style.zIndex = this.zIndex.toString();
        this.parentElement.id = this.wrapperId;
        impl._webview.id = this.webviewId;
        impl._webview.title = this.webviewId;
        (impl._webview as HTMLIFrameElement).allow = "autoplay";
    }

    @render(PlaylistStore, (store) => store.playlist)
    renderLinkPlay(playlist: string) {
        if (!playlist) {
            return;
        }
        const languageId = LOCALE_MAPPING[gc.Translator.getLanguageId()] || "en-US";
        this.currentPlaylist = playlist;
        this.webview.url = `${playlist}&language=${languageId}`;
    }

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openGuide({ event }: { event: InGameMenuEvents }) {
        if (
            event === InGameMenuEvents.OPEN_GUIDE ||
            event.includes("open_guide_scroll") ||
            event === InGameMenuEvents.OPEN_HISTORY ||
            event === InGameMenuEvents.OPEN_TICKET_DETAIL
        ) {
            this.setOpacityIframe(0);
            return;
        }

        this.setOpacityIframe(1);
    }

    setOpacityIframe(cssOpacity: number) {
        const impl = (this.webview as any)?._impl;
        if (impl?._webview?.style) {
            impl._webview.style.opacity = cssOpacity;
            this.parentElement.style.setProperty("left", cssOpacity === 0 ? "-100%" : "0px", "important");
        }
    }

    postMessageToIframe = <T extends Record<string, any>>(data: [string, T]): void => {
        if (!this.marbleTvReady) {
            return;
        }
        (document.getElementById(this.webviewId) as HTMLIFrameElement)?.contentWindow?.postMessage(data, this.currentPlaylist);
    };
}
