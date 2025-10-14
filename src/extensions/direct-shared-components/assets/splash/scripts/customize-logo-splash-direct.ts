import { _decorator } from "cc";
import * as i18n from "db://i18n/LanguageData";
import { OperatorAlias } from "db://shared-components/shared/utils";
import { CustomizeLogoSplash } from "db://shared-components/splash/scripts/components/customize-logo-splash";
const { ccclass, property } = _decorator;

const POWEREDBY = {
    [OperatorAlias.SG]: "bong88",
    [OperatorAlias.TIP88]: "vg",
};
@ccclass
export class CustomizeLogoSplashDirect extends CustomizeLogoSplash {
    onLoad(): void {
        super.onLoad();
    }

    override createPoweredByPath(system: string) {
        if (system === POWEREDBY[OperatorAlias.SG]) {
            return `${this.href}images/powered_by_${system}.webp?v=${this.versionImg}`;
        }
        const lang = i18n._language;
        return `${this.href}images/powered_by_${system}_${lang}.webp?v=${this.versionImg}`;
    }
}
