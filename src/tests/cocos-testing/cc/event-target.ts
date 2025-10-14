export class EventTarget {
    on = jest.fn();
    off = jest.fn();
    emit = jest.fn();
    targetOff = jest.fn();
    removeAll = jest.fn();
    once = jest.fn();
    hasEventListener = jest.fn();
}
