import inversify from "inversify";
import gc from "@sg/game-client-base";

const { injectable, inject } = inversify;
@injectable()
export class MarbleRoundHandler implements gc.Shared.IHandler<any> {
    name = "gameFlow";

    handle(input: any) {
        console.log("Handler what ", JSON.stringify(input));
    }
}