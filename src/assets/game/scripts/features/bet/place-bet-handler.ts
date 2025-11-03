import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MarbleBetStore } from "./bet-store";

const { injectable, inject } = inversify;

@injectable()
export class PlaceBetHandler implements gc.Shared.IHandler<boolean> {
    @inject(MarbleBetStore) private readonly betStore: MarbleBetStore;
    name = "spb";

    handle(input: boolean) {
        this.betStore.allowBet = input;
    }
}
