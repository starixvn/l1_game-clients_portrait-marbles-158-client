window.envConfig = {
    isDev: false, // if this property is true, then you should add token=anything into the querytring to sso to the game http://localhost:7456/?token=anything
    systemType: "SG",
    serverDomainMapper: {
        localhost: "lumigame.com",
    },
    ssl: true,
    subDomain: "l1-proxy3",
    env: "LOCAL",
    subGuideDomain: "l1-guide-3",
    SGConnectSubDomain: "connectsite",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false,
    websocket: {
        proxyPath: "rocketx",
        route: "rocketx",
    },
    tolgeeUrl: "",
    backgroundLocalized: true,
};

console.error("Wrong mapping config, please check your deployment");
