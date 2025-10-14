import gc from "@sg/game-client-base";

declare global {
    interface Window {
        envConfig: gc.Configs.SiteConfigs;
        crossConfig: gc.Configs.SiteConfigs;
    }
}

const defaultConfig: gc.Configs.SiteConfigs = {
    isDev: false,
    systemType: "VG",
    serverDomainMapper: {
        localhost: "lumigame.com",
    },
    ssl: true,
    subDomain: "l2-proxy",
    env: "LOCAL0",
    subGuideDomain: "hd-guide",
    enableMsgpackParserOnNotification: false,
    enableMsgpackParserAllGames: false,
    websocket: {
        proxyPath: "marblefootball2",
        route: "marblefootball2",
    },
    tolgeeUrl: "",
    storagePrefixKey: "portrait_marbleFootball2",
    sentry: {
        dsn: "https://9c999f9b51e3b4543cb160b946b5bcbe@sentry-k8s.lumigame.com/30",
        browserUrl: "https://browser.sentry-cdn.com/10.5.0/bundle.min.js",
        urlHash: "sha384-SAsRvjfAFRX3iwi3MG6ToeZNJVpHcRXKcITfFVLQipWK3uQ8SakuVmHDoSR3YNmJ",
        ignoreErrors: [],
    },
};

let configDev = {
    isDev: defaultConfig.isDev,
    userServiceUrlDev: defaultConfig.userServiceUrlDev,
    serverDomainMapper: defaultConfig.serverDomainMapper,
    notificationServiceUrlDev: defaultConfig.notificationServiceUrlDev,
};

if (window.envConfig) {
    configDev = {
        isDev: undefined,
        userServiceUrlDev: undefined,
        serverDomainMapper: undefined,
        notificationServiceUrlDev: undefined,
    };
}

export const siteConfigs: gc.Configs.SiteConfigs =
    window.envConfig && window.envConfig.isDev
        ? defaultConfig
        : { ...defaultConfig, ...configDev, ...window.envConfig, ...window.crossConfig };

window.envConfig = siteConfigs;
gc.Shared.utils.StorageManager.setPrefixKey(siteConfigs.storagePrefixKey);
