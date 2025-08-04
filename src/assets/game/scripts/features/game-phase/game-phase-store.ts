import inversify from "inversify";
import mobx from "mobx";
import { GamePhase, PhaseId } from "./game-phase-definitions";
import { log } from "cc";

const { injectable, inject } = inversify;

@injectable()
export class GamePhaseStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    enterPhase: GamePhase = null;
    exitPhase: GamePhase = null;
    beforeEnterPhase: GamePhase = null;

    setEnterPhase(phase: GamePhase) {
        setTimeout(() => {
            this.printCurrentPhases();
            this.enterPhase = phase;
        }, 0);
    }

    setExitPhase(phase: GamePhase) {
        setTimeout(() => {
            this.printCurrentPhases();
            this.exitPhase = phase;
        }, 0);
    }

    setBeforeEnterPhase(phase: GamePhase) {
        setTimeout(() => {
            this.beforeEnterPhase = phase;
        }, 0);
    }

    // Utility method to get enum key from phase ID
    getPhaseEnumKey(phaseId: string): string | null {
        const enumKeys = Object.keys(PhaseId);
        for (const key of enumKeys) {
            if (PhaseId[key as keyof typeof PhaseId] === phaseId) {
                return key;
            }
        }
        return null;
    }

    // Debug method to print phase as enum
    printPhaseAsEnum(phase: GamePhase) {
        if (!phase) {
            log("Phase is null");
            return;
        }
        
        const enumKey = this.getPhaseEnumKey(phase.id);
        if (enumKey) {
            log(`Phase: ${enumKey} (${phase.id})`);
        } else {
            log(`Phase ID not found in enum: ${phase.id}`);
        }
    }

    // Debug method to print current phases
    printCurrentPhases() {
        log("=== Current Game Phases ===");
        if (this.enterPhase) {
            log("Enter Phase:");
            this.printPhaseAsEnum(this.enterPhase);
        }
        if (this.exitPhase) {
            log("Exit Phase:");
            this.printPhaseAsEnum(this.exitPhase);
        }
        if (this.beforeEnterPhase) {
            log("Before Enter Phase:");
            this.printPhaseAsEnum(this.beforeEnterPhase);
        }
        log("==========================");
    }
}
