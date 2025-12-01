import gc from "@sg/game-client-base";
import inversify from "inversify";
import { PlaylistStore } from "./playlist-store";

const { injectable, inject } = inversify;

@injectable()
export class PlaylistHandler implements gc.Shared.IHandler<string> {
    name = "playlist";
    @inject(PlaylistStore) private readonly playlistStore: PlaylistStore;
    handle(playlist: string) {
        console.log("playlist-handler handle", playlist);
        this.playlistStore.playlist = playlist;
    }
}
