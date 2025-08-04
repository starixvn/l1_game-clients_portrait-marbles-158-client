export namespace MarbleFootballServiceMessages {
    export type MatchType = {
        home: string;
        away: string;
        id?: number;
        homeWins?: boolean;
    };

    export class Match {
        home: string;
        away: string;

        static eventName = "match";
    }

    export class VideoStream {
        video: string;
        timeline: number[];
        result: string;

        static eventName = "videoResult";
    }

    export class LiveStreamServer {
        static eventName = "liveStreamServer";
    }

    export class Tournament {
        code: string;
        matches: MatchType[];
        currentMatch: number;
        ended: boolean;

        static eventName = "tournament";
    }

    export interface Penalty {
        home: number;
        away: number;
    }

    export interface Result {
        firstHalf: string;
        secondHalf: string;
        firstHalfVideo: string;
        secondHalfVideo: string;
        overUnderValue: number;
        homeWinsOnDraw?: boolean;
        tournamentId: string;
        firstHalfTimeline: number[];
        secondHalfTimeline: number[];
        penalty: Penalty;
    }
}
