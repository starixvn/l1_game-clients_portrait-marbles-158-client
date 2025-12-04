import gc from "@sg/game-client-base";
import { _decorator, find } from "cc";

import BetHistoryContainer from "db://shared-components/game/bet-history/scripts/components/bet-history-container";
import { Dialog } from "db://shared-components/shared/common-components/dialogs/dialog";
import CustomWebview from "../custom-webview/custom-webview";

const { ccclass } = _decorator;

@ccclass("MarbleBetHistoryContainer")
export default class MarbleBetHistoryContainer extends BetHistoryContainer {
    private customWebview: CustomWebview | null = null;

    override showBetHistory(betHistoryModel: gc.BetHistory.BetHistoryModel) {
        super.showBetHistory(betHistoryModel);
        this.setupDialogHideCallback();
    }

    private setupDialogHideCallback() {
        const dialog = this.getComponentInChildren(Dialog);
        dialog &&
            (dialog.onHideComplete = () => {
                this.restoreWebviewOpacity();
            });
    }

    private getCustomWebview() {
        if (!this.customWebview) {
            this.customWebview = find("Canvas")?.getComponentInChildren(CustomWebview) || null;
        }

        return this.customWebview;
    }

    private restoreWebviewOpacity() {
        this.getCustomWebview()?.setOpacityIframe(1);
    }

    popupVisibility(forceClosed: any) {
        super.popupVisibility(forceClosed);
        this.restoreWebviewOpacity();
    }
}
