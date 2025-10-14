import { Node } from "cc";

jest.mock("db://shared-components/shared/common-components/observer-component/scripts/observer-component", () => ({
    ObserverComponent: class MockObserverComponent {
        onLoad() {}
        onDestroy() {}
        start() {}
        update() {}
        node = new Node();
    },
}));
