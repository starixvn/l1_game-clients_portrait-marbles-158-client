import { _decorator, find } from "cc";
import { GameGuideContainer } from "db://shared-components/game/game-guide/scripts/game-guide-container";
import WebViewGuide from "db://shared-components/game/game-guide/scripts/web-view-guide";
import { Dialog } from "db://shared-components/shared/common-components/dialogs/dialog";
import CustomWebview from "../custom-webview/custom-webview";

const { ccclass } = _decorator;

@ccclass("MarbleGameGuideContainer")
export class MarbleGameGuideContainer extends GameGuideContainer {
    private customWebview: CustomWebview | null = null;

    onLoad() {
        super.onLoad();
        this.customWebview = find("Canvas")?.getComponentInChildren(CustomWebview) || null;
    }

    protected openDialog(scrollToId: string) {
        const guide = this.createNode();
        guide.getComponent(WebViewGuide)?.initUrl("&o=portrait", scrollToId);
        guide.getComponent(Dialog).onHideComplete = () => {
            this.customWebview?.setOpacityIframe(1);
        };
    }
}
