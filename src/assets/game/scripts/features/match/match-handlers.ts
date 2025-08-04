import inversify from "inversify";
import { MatchStore } from "./match-store";
import { MarbleFootballServiceMessages } from "../../marble-football-service-messages";
import { log } from "cc";

const { injectable, inject } = inversify;

@injectable()
export class MatchHandlers {
    @inject(MatchStore) private readonly matchStore: MatchStore;

    handleMatchChange(match: MarbleFootballServiceMessages.Match) {
        log("RECEIVED HANDLER MATCH", match);
        this.matchStore.match = match;
    }

    eventHandleList = [
        {
            name: MarbleFootballServiceMessages.Match.eventName,
            handle: this.handleMatchChange,
        },
    ];
}