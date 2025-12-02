import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { WarningCmp } from "db://shared-components/shared/common-components/notice/scripts/warning-cmp";
import { WarningContainer } from "db://shared-components/shared/common-components/notice/scripts/warning-container";
import Observer from "observer";
import { PointsStore } from "../../features/points/points-store";
import { BetOptionsData } from "../../types";

const { render } = Observer;

const { Notices, Bet } = gc;
const { ccclass, property } = _decorator;

@ccclass("MarbleWarningContainer")
export class MarbleWarningContainer extends WarningContainer {
    protected points: BetOptionsData = {};
    @render(PointsStore, (store) => store.points)
    renderPoints(points: BetOptionsData) {
        this.points = points;
    }
    showWarning(warning: gc.Notices.Warning) {
        const processedMessage = this.replacePlaceholders(warning.message);

        const node = this.createNode();
        const warningCmp = node.getComponent(WarningCmp);
        warningCmp.setData(processedMessage);
    }

    private replacePlaceholders(message: string): string {
        const placeholder = "%{point}";

        if (!message.includes(placeholder)) {
            return message;
        }

        const replacements = [String(this.points?.over ?? ""), String(this.points?.under ?? "")];

        let replacementIndex = 0;
        return message.replace(/%\{point\}/g, () => {
            const value = replacements[replacementIndex] ?? "";
            replacementIndex++;
            return value;
        });
    }
}
