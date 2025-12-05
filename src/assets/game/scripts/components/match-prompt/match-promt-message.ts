import gc from "@sg/game-client-base";
import { _decorator, Enum, Sprite, SpriteAtlas, tween, UIOpacity } from "cc";
import PromptMessageComponent from "db://shared-components/game/prompt-message/scripts/prompt-message-component";
const { ccclass, property } = _decorator;
const { Translator } = gc;

export enum IconName {
    COIN = 0,
    CUP = 1,
    HAND = 2,
    WHISTLE = 3,
}

const iconNameMap = {
    [IconName.COIN]: "icon_coin",
    [IconName.CUP]: "icon_cup",
    [IconName.HAND]: "icon_hand",
    [IconName.WHISTLE]: "icon_whistle",
};

@ccclass("MatchPromptMessage")
export class MatchPromptMessage extends PromptMessageComponent {
    _icon: IconName = IconName.CUP;

    @property({ type: Enum(IconName) })
    get icon() {
        return this._icon;
    }

    set icon(icon: IconName) {
        this._icon = icon;
        this.iconSprites.forEach((sprite, _) => {
            sprite.spriteFrame = this.iconAtlas.getSpriteFrame(iconNameMap[icon]);
        });
    }

    @property([Sprite])
    iconSprites: Sprite[] = [];

    @property(SpriteAtlas)
    iconAtlas: SpriteAtlas = null;

    protected durationAnimOpacity = 1;

    prompt() {
        const cpmOpacity = this.node.getComponent(UIOpacity);
        cpmOpacity.opacity = 1;

        tween(cpmOpacity).to(this.durationAnimOpacity, { opacity: 255 }, { easing: this.easingStart }).start();
    }

    showTimeUpMessage() {
        const message = Translator.gameTranslate("time_up").toUpperCase();
        this.icon = IconName.WHISTLE;
        this.content = message;
    }

    showStartBetMessage() {
        const message = Translator.commonTranslate("message_place_bets").toUpperCase();
        this.icon = IconName.COIN;
        this.content = message;
    }

    showStopBetMessage() {
        const message = Translator.commonTranslate("message_stop_bet").toUpperCase();
        this.icon = IconName.HAND;
        this.content = message;
    }

    showNextMatchMessage() {
        const message = Translator.gameTranslate("next_match").toUpperCase();
        this.icon = IconName.CUP;
        this.content = message;
    }
}
