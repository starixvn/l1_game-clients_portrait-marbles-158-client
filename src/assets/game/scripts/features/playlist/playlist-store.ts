import inversify from "inversify";
import mobx from "mobx";

const { injectable } = inversify;

@injectable()
export class PlaylistStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _playlist = "";

    get playlist() {
        return this._playlist;
    }

    set playlist(playlist: string) {
        this._playlist = playlist;
    }
}
