import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { MarbleFootballServiceMessages } from "../marble-football-service-messages";
import { Flag } from "./flag";
import { TeamName } from "./team-name";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("Teams")
export class Teams extends ObserverComponent {
    @property(Flag)
    home: Flag = null;

    @property(Flag)
    away: Flag = null;

    @property(TeamName)
    homeName: TeamName = null;

    @property(TeamName)
    awayName: TeamName = null;

    @property(Label)
    homeCode: Label = null;

    @property(Label)
    awayCode: Label = null;
}
