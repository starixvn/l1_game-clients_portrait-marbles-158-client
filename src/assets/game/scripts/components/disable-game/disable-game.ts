import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";

const { ccclass } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class DisableGame extends ObserverComponent {
    @render(gc.DisabledGame.DisabledGameStore, (store) => store.disabled, { fireImmediately: false })
    protected onGameDisabled(disabled: boolean) {
        if (disabled) {
            this.showGameDisabledPopup();
        }
    }

    @handle(gc.DisabledGame.DisableGameHandlers, (handler) => handler.showPopupHandle())
    protected showGameDisabledPopup() {}
}
