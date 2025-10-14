import { _decorator, Component, sp } from "cc";
import { Flag } from "../flag";
import { TeamName } from "../team-name";
const { ccclass, property } = _decorator;

@ccclass("TournamentTeam")
export class TournamentTeam extends Component {
    @property(Flag)
    flag: Flag = null;

    @property(TeamName)
    teamName: TeamName = null;

    setAnimation(animation: string) {
        const spine = this.getComponentsInChildren(sp.Skeleton)[0];
        if (spine) {
            spine.premultipliedAlpha = animation === "out";
            spine.setAnimation(0, animation, false);
        }
    }

    setName(shortName: string) {
        this.flag.setIcon(shortName);
        this.teamName.setName(shortName);
    }
}
