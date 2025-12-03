import gc from "@sg/game-client-base";
import { _decorator, find } from "cc";
import { NoticeContainer } from "db://shared-components/shared/common-components/notice/scripts/notice-container";
import CustomWebview from "../custom-webview/custom-webview";

const { ccclass } = _decorator;

@ccclass("MarbleNoticeDirectContainer")
export class MarbleNoticeDirectContainer extends NoticeContainer {
    private customWebview: CustomWebview | null = null;

    protected override async showNoticeComponent(notice: gc.Notices.Notice) {
        super.showNoticeComponent(notice);
        this.noticeCmp &&
            (this.noticeCmp.onHideComplete = () => {
                this.getCustomWebview()?.setOpacityIframe(1);
            });
    }

    private getCustomWebview() {
        if (!this.customWebview) {
            this.customWebview = find("Canvas")?.getComponentInChildren(CustomWebview) || null;
        }

        return this.customWebview;
    }
}
