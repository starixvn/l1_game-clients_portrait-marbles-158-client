import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

@ccclass("Score")
export class Score extends ObserverComponent {
    @property(Label)
    protected home: Label = null;

    @property(Label)
    protected away: Label = null;

    onLoad() {
        this.setHome(0);
        this.setAway(0);
        super.onLoad();
    }

    setHome(home: number) {
        this.home.string = home.toString();
    }

    setAway(away: number) {
        this.away.string = away.toString();
    }
}
