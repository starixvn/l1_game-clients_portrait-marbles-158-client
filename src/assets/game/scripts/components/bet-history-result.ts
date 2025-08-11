import { _decorator, Color, Label, log } from "cc";
import gc from "@sg/game-client-base";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { Flag } from "./flag";
const { ccclass, property } = _decorator;

interface RoundResult {
    firstHalf: string;
    secondHalf: string;

    teamName: { home: string; away: string };
}

@ccclass("BetHistoryResult")
export class BetHistoryResult extends BaseResultBodyItem {
    @property(Flag)
    home: Flag = null;

    @property(Flag)
    away: Flag = null;

    @property(Label)
    homeCode: Label = null;

    @property(Label)
    awayCode: Label = null;

    @property(Label)
    homeScore: Label = null;

    @property(Label)
    awayScore: Label = null;

    setTeams(home: string, away: string) {

        const processedHome = home.split("_")[1];
        const processedAway = away.split("_")[1];

        this.home.setIcon(processedHome.toUpperCase());
        this.homeCode.string = processedHome;
        this.away.setIcon(processedAway.toUpperCase());
        this.awayCode.string = processedAway;
    }

    highlightLabels(label: Label[]) {
        const highlight = new Color().fromHEX("F1E344");
        for (const l of label) {
            l.color = highlight;
        }
    }

    setScore(home: number, away: number) {
        this.homeScore.string = home.toString();
        this.awayScore.string = away.toString();
    }

    setData(result: gc.BetHistory.DynamicObject<any>, settlementResult: gc.BetHistory.DynamicObject<any>) {
        const { firstHalf, secondHalf, match } = result;
        const home = firstHalf.home + secondHalf.home;
        const away = firstHalf.away + secondHalf.away;
        this.setScore(home, away);

        if (home > away) {
            this.highlightLabels([this.homeCode, this.homeScore]);
        }

        if (home < away) {
            this.highlightLabels([this.awayCode, this.awayScore]);
        }
        this.setTeams(match.home, match.away);
    }

    private countCharacters(str: string, char: string) {
        return str.split(char).length - 1;
    }
}
