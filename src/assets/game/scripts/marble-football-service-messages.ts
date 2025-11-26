export namespace MarbleFootballServiceMessages {
    export type MatchType = {
        home: string;
        away: string;
        id?: number;
        homeWins?: boolean;
    };

    export class VideoStream {
        firstHalfVideo: string;
        secondHalfVideo: string;
        firstHalfTimeline: number[];
        secondHalfTimeline: number[];
        firstHalf: string;
        secondHalf: string;

        static eventName = "videoResult";
    }

    export class LiveStreamServer {
        static eventName = "liveStreamServer";
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
        firstHalfTimeline: number[];
        secondHalfTimeline: number[];
        penalty: Penalty;
    }
}
