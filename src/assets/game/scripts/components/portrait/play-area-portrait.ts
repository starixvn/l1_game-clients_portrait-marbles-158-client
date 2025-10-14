import { _decorator, Node } from "cc";
import { AnimationHelper } from "../helpers/animation-helper";
import { DEFAULT_TWEEN_CONFIGS_PORTRAIT } from "../helpers/tween-configs";
import { PlayArea } from "../play-area";

const { ccclass } = _decorator;

@ccclass("PlayAreaPortrait")
export class PlayAreaPortrait extends PlayArea {
    onLoad() {
        this.tweenConfigs = DEFAULT_TWEEN_CONFIGS_PORTRAIT;
        super.onLoad();
    }

    protected override setupStaticTargets() {
        const staticTargets = [
            { node: this.teamScore, config: this.tweenConfigs.fadeInOut.out },
            { node: this.hiddenPlayersNode, config: this.tweenConfigs.fadeInOut.out },
        ];

        staticTargets.forEach(({ node, config }) => {
            AnimationHelper.setStaticTarget(node, config);
        });
    }

    protected override getShowBetChoicesAnimConfig(): { nodes: Node[]; configs: any[] } {
        return {
            nodes: [this.scoreBoard, this.hiddenPlayersNode, this.teamScore],
            configs: [this.tweenConfigs.scoreBoardInOut.in, this.tweenConfigs.fadeInOut.in, this.tweenConfigs.fadeInOut.in],
        };
    }

    protected override getShowVideoAnimConfig(): { nodes: Node[]; configs: any[] } {
        return {
            nodes: [this.teamScore, this.hiddenPlayersNode],
            configs: [this.tweenConfigs.fadeInOut.in, this.tweenConfigs.fadeInOut.out],
        };
    }
}
