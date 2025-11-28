import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { BetOptionsData } from "../types";
import { PointsStore } from "./points-store";

const { injectable, inject } = inversify;

@injectable()
export class PointsHandler implements gc.Shared.IHandler<BetOptionsData> {
    @inject(PointsStore) private readonly pointsStore: PointsStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    name = "points";
    handle(data: BetOptionsData) {
        console.log("points-handler handle", JSON.stringify(data));
        this.pointsStore.points = data;
    }
}
