import { _decorator, CCInteger, CCString, log, WebView } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

@ccclass
export default class CustomWebview extends ObserverComponent {
    @property(WebView)
    webview: WebView = null;

    @property(CCString)
    wrapperId = "custom-webview-wrapper";

    @property(CCInteger)
    zIndex = -1;

    onLoad() {
        log("webview loaded");
        super.onLoad();
        this.scheduleOnce(() => {
            this.modifyWebViewWrapper();
        }, 0.1);
    }

    modifyWebViewWrapper() {
        const impl = (this.webview as any)._impl;
        if (!impl?._webview?.parentElement) {
            console.warn("WebView not ready.");
            return;
        }
        const wrapper = impl._webview.parentElement;
        wrapper.style.zIndex = this.zIndex.toString();
        wrapper.id = this.wrapperId;
        impl._webview.id = `${this.wrapperId}-webview`;
        impl._webview.title = `${this.wrapperId}-webview`;
        (impl._webview as HTMLIFrameElement).allow = "autoplay";
        (impl._webview as HTMLIFrameElement).allow = "private-network";
    }
}
