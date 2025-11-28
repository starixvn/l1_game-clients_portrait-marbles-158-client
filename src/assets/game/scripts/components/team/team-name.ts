import { _decorator, Component } from "cc";
import { TRANSLATE_NAMESPACE } from "../../game-settings";

const { ccclass } = _decorator;

@ccclass("TeamName")
export class TeamName extends Component {
    setName(shortName: string) {
        const label = this.getComponent("LocalizedLabel") as any;
        if (label) {
            label.setKey(`${TRANSLATE_NAMESPACE}.team_${shortName}`);
        }
    }
}
