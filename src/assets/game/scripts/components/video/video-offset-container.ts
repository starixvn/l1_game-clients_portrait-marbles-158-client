import { _decorator, Component, Node, screen, UITransform, Vec3, view } from "cc";
import { EDITOR } from "cc/env";
import { ComponentUtils, AnimationUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

export const SYNC_VIDEO_DIMENSION_EVENT = "syncWidthOffset";
export const TOP_OFFSET_DEFAULT = 41;

interface Dimensions {
    width: number;
    height: number;
}

@ccclass("VideoOffSetContainer")
export class VideoOffSetContainer extends Component {
    @property(Node)
    containerNode: Node = null;

    @property(Node)
    targetNode: Node = null;

    @property(Node)
    fieldNode: Node = null;

    private readonly lastContainerPosition = new Vec3();

    private readonly onParentSizeChanged = () => {
        this.updateDisplay();
    };

    private toggleSizeChangedListener(enable: boolean) {
        const method = enable ? "on" : "off";
        if (this.node.parent) {
            this.node.parent[method](Node.EventType.SIZE_CHANGED, this.onParentSizeChanged, this);
        }
        if (this.node) {
            this.node[method](Node.EventType.SIZE_CHANGED, this.onParentSizeChanged, this);
        }
    }

    public async onEnable() {
        this.toggleSizeChangedListener(true);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.toggleSizeChangedListener(false);
    }

    public async update(delta: number) {
        if (this.containerNode && !this.containerNode.position.equals(this.lastContainerPosition)) {
            this.updateDisplay();
            this.lastContainerPosition.set(this.containerNode.position);
        }

        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected async updateDisplay() {
        await AnimationUtils.delayTime(300/1000);
        const scaleX = this.getNodeScaleX();
        const topOffsetAbs = this.calculateTopOffsetAbs(scaleX);
        const { width: fieldWidth, height: fieldHeight } = this.getFieldNodeWorldSize();
        const { width: widthFinal, height: heightFinal } = this.calculateFinalDimensions(fieldWidth, fieldHeight);

        this.node.emit(SYNC_VIDEO_DIMENSION_EVENT, {
            width: widthFinal,
            height: heightFinal,
            top: topOffsetAbs,
        });
    }

    private getNodeScaleX(): number {
        return this.node?.scale?.x || 1;
    }

    private calculateTopOffsetAbs(scaleX: number): number {
        const position = ComponentUtils.convertPosition(this.containerNode, this.targetNode);
        const topOffset = position.y ?? 0;
        return Math.abs(topOffset) * scaleX;
    }

    private getFieldNodeWorldSize(): Dimensions {
        const uiTransform = this.fieldNode?.getComponent(UITransform);
        const boundingBox = uiTransform?.getBoundingBoxToWorld();
        return {
            width: boundingBox?.width || 0,
            height: boundingBox?.height || 0,
        };
    }

    private calculateFinalDimensions(fieldWidth: number, fieldHeight: number): Dimensions {
        const dpr = screen.devicePixelRatio;
        const currentScreenWidth = screen.windowSize?.width;
        const designScreenWidth = view.getDesignResolutionSize().width;
        const scaleXCanvas = currentScreenWidth / designScreenWidth;
        return {
            width: (fieldWidth * scaleXCanvas) / dpr,
            height: (fieldHeight * scaleXCanvas) / dpr,
        };
    }
}
