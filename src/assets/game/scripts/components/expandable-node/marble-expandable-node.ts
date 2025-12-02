import { _decorator, v3 } from "cc";
import { ExpandableNode } from "db://shared-components/shared/common-components/expandable-node/scripts/expandable-node";
const { ccclass } = _decorator;

@ccclass("MarbleExpandableNode")
export class MarbleExpandableNode extends ExpandableNode {
    protected readonly collapseScale = v3(0, 1, 1);
}
