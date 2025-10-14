import { _decorator, Component, sp } from "cc";

const { ccclass, property } = _decorator;

@ccclass("BreakTime")
export class BreakTime extends Component {
    @property(sp.Skeleton)
    breakTime: sp.Skeleton = null;

    private get breakTimeNode() {
        return this.breakTime?.node;
    }

    private setBreakTimeNodeActive(active: boolean) {
        if (this.breakTimeNode?.parent) {
            this.breakTimeNode.parent.active = active;
        }
    }

    protected onLoad(): void {
        this.setBreakTimeNodeActive(false);
    }

    protected onDisable(): void {
        this.setBreakTimeNodeActive(false);
    }

    playAnimation(at = 0) {
        const name = "animation";
        this.setBreakTimeNodeActive(true);
        if (this.breakTime) {
            this.breakTime.setAnimation(0, name, false);
            const animation = this.breakTime.findAnimation(name);
            const entry = this.breakTime.getCurrent(0);
            if (at > animation.duration) {
                entry.trackTime = animation.duration;
            } else {
                entry.trackTime = at;
            }

            this.breakTime.setCompleteListener(() => {
                this.setBreakTimeNodeActive(false);
            });
        }
    }
}
