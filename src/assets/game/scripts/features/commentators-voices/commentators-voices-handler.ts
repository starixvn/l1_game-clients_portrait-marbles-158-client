import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { CommentatorsVoicesStore, IVoices } from "./commentators-voices-store";

const { injectable, inject } = inversify;

@injectable()
export class CommentatorsVoicesHandler implements gc.Shared.IHandler<IVoices> {
    @inject(CommentatorsVoicesStore) private readonly store: CommentatorsVoicesStore;
    name = "voices";

    constructor() {
        // TODO: Update this after video stream is implemented
        setTimeout(() => {
            mobx.reaction(
                () => true,
                (isPlayVideo) => {
                    if (isPlayVideo) {
                        this.store.loadVoices();
                    }
                }
            );
        }, 0);
    }

    handle(input: IVoices) {
        if (input && Object.keys(input).length > 0) {
            this.store.voices = input;
        }
    }

    handleLoadVoices() {
        this.store.loadVoices();
    }
}
