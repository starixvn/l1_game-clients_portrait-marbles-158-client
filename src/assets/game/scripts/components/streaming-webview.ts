import { _decorator, WebView } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { VideoStreamStore } from "../features/video-stream/video-stream-store";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export default class StreamingWebview extends ObserverComponent {
    private _webview: WebView = null;

    onLoad() {
        super.onLoad();
        this._webview = this.node.getComponent(WebView);
    }

    @render(VideoStreamStore, (store) => store.liveStreamServer)
    renderLiveStreamServer(liveStreamServer: string) {
        if (!this._webview) return;
        this._webview.url = liveStreamServer;
    }
}
