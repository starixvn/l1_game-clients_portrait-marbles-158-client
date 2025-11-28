import inversify from "inversify";
import mobx from "mobx";
import { BetOptionsData } from "../types";

const { injectable } = inversify;

@injectable()
export class PointsStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _points: BetOptionsData = {};

    get points() {
        return this._points;
    }

    set points(points: BetOptionsData) {
        this._points = points;
    }
}
