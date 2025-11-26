import { _decorator, Component, tween, UIOpacity } from "cc";

const { ccclass, property } = _decorator;

@ccclass("IntroOutro")
export class IntroOutro extends Component {
    @property(UIOpacity)
    gameBackground: UIOpacity = null;

    @property(UIOpacity)
    field: UIOpacity = null;

    @property(UIOpacity)
    fieldBlur: UIOpacity = null;

    @property(UIOpacity)
    containerGameBackground: UIOpacity = null;

    private readonly maxOpacity = 255;

    set showGameBackground(value: boolean) {
        this.gameBackground.node.active = value;
        this.containerGameBackground.node.active = value;
        this.fieldBlur.node.active = value;
    }

    set showField(value: boolean) {
        this.field.node.active = value;
    }

    private processOpacity(value: number) {
        if (this.gameBackground) {
            this.gameBackground.opacity = value;
        }

        if (this.fieldBlur) {
            this.fieldBlur.opacity = value;
        }

        if (this.containerGameBackground) {
            this.containerGameBackground.opacity = value;
        }
    }

    private processTween(targetOpacity: number, duration: number) {
        const processTween = [];
        if (this.gameBackground) {
            processTween.push(tween(this.gameBackground).to(duration, { opacity: targetOpacity }));
        }
        if (this.fieldBlur) {
            processTween.push(tween(this.fieldBlur).to(duration, { opacity: targetOpacity }));
        }
        if (this.containerGameBackground) {
            processTween.push(tween(this.containerGameBackground).to(duration, { opacity: targetOpacity }));
        }

        if (processTween.length > 0) {
            tween()
                .parallel(...processTween)
                .start();
        }
    }

    playIntroAnimation(at = 0, duration = 2) {
        if (at >= duration || at < 0 || duration < 0) {
            return;
        }

        const percent = 1 - at / duration;
        this.processOpacity(this.maxOpacity * percent);
        this.processTween(0, duration - at);
    }

    playOutroAnimation(at = 0, duration = 2) {
        if (at >= duration || at < 0 || duration < 0) {
            return;
        }

        const percent = at / duration;
        this.processOpacity(this.maxOpacity * percent);
        this.processTween(this.maxOpacity, duration - at);
    }

    setMaxBackgroundOpacity() {
        this.gameBackground.opacity = this.maxOpacity;
        this.containerGameBackground.opacity = this.maxOpacity;
        this.fieldBlur.opacity = this.maxOpacity;
    }
}
