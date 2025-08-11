import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { TournamentStore } from "../features/tournament/tournament-store";
import { MarbleFootballServiceMessages } from "../marble-football-service-messages";
import { Flag } from "./flag";
import { TeamName } from "./team-name";
import { MatchStore } from "../features/match/match-store";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("Teams")
export class Teams extends ObserverComponent {
    @property(Flag)
    private home: Flag = null;

    @property(Flag)
    private away: Flag = null;

    @property(TeamName)
    private homeName: TeamName = null;

    @property(TeamName)
    private awayName: TeamName = null;

    @property(Label)
    private homeCode: Label = null;

    @property(Label)
    private awayCode: Label = null;

    @render(MatchStore, (store) => store.match)
    setTeams(currentMatch: MarbleFootballServiceMessages.Match) {
        if (currentMatch && currentMatch.home && currentMatch.away) {
            const processedHome = currentMatch.home.split("_")[1];
            const processedAway = currentMatch.away.split("_")[1];
            this.home?.setIcon(processedHome.toUpperCase());
            this.away?.setIcon(processedAway.toUpperCase());
            this.homeName?.setName(processedHome);
            this.awayName?.setName(processedAway);
            this.homeCode && (this.homeCode!.string = processedHome);
            this.awayCode && (this.awayCode!.string = processedAway);
        }
    }
}
