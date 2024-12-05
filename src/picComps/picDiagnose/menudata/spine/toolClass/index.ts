import * as cornerstoneTools from '@cornerstonejs/tools';
const {triggerAnnotationRenderForViewportIds} = cornerstoneTools.utilities;
import { Enums } from '@cornerstonejs/core';
import type { Types } from '@cornerstonejs/core';
console.log(Enums);


const MAGNIFY_VIEWPORT_ID = 'magnify-viewport';

const {annotation,MagnifyTool,ProbeTool ,LengthTool} = cornerstoneTools;
const {ChangeTypes} = cornerstoneTools.Enums


class CircularMagnifyTool extends  MagnifyTool {
  static toolName ;

  constructor(props) {
    super(props);
  }

  _createMagnificationViewport =() =>{
    const {
      enabledElement,
      referencedImageId,
      viewportIdsToRender,
      renderingEngine,
      currentPoints,
    } = this.editData;
    const { viewport } = enabledElement;
    const { element } = viewport;
    const viewportProperties = viewport.getProperties();

    const { canvas: canvasPos, world: worldPos } = currentPoints;

    let magnifyToolElement: HTMLDivElement;

    magnifyToolElement = element.querySelector('.magnifyTool');
    if (magnifyToolElement === null) {
      const magnifyElement = document.createElement('div');
      magnifyElement.classList.add('magnifyTool');

      magnifyElement.style.display = 'block';
      magnifyElement.style.width = `${this.configuration.magnifyWidth}px`;
      magnifyElement.style.height = `${this.configuration.magnifyHeight}px`;
      magnifyElement.style.position = 'absolute';

      //自定义属性添加
      magnifyElement.style.borderRadius = '50%';
      magnifyElement.style.overflow = 'hidden'; // 隐藏超出部分
      magnifyElement.style.border = '1px solid white'; // 边框


      magnifyToolElement = magnifyElement;

      const viewportElement = element.querySelector('.viewport-element');
      viewportElement.appendChild(magnifyElement);

      const viewportInput = {
        viewportId: MAGNIFY_VIEWPORT_ID,
        type: Enums.ViewportType.STACK,
        element: magnifyToolElement as HTMLDivElement,
      };

      renderingEngine.enableElement(viewportInput);
    }

    // Todo: use CSS transform instead of setting top and left for better performance
    magnifyToolElement.style.top = `${
      canvasPos[1] - this.configuration.magnifyHeight / 2
    }px`;
    magnifyToolElement.style.left = `${
      canvasPos[0] - this.configuration.magnifyWidth / 2
    }px`;

    const magnifyViewport = renderingEngine.getViewport(
      MAGNIFY_VIEWPORT_ID
    ) as Types.IStackViewport;
    magnifyViewport.setStack([referencedImageId]).then(() => {
      if (this._hasBeenRemoved) {
        return;
      }
      // match the original viewport voi range
      magnifyViewport.setProperties(viewportProperties);

      // Use the original viewport for the base for parallelScale
      const { parallelScale } = viewport.getCamera();

      const { focalPoint, position, viewPlaneNormal } =
        magnifyViewport.getCamera();

      const distance = Math.sqrt(
        Math.pow(focalPoint[0] - position[0], 2) +
          Math.pow(focalPoint[1] - position[1], 2) +
          Math.pow(focalPoint[2] - position[2], 2)
      );

      const updatedFocalPoint = <Types.Point3>[
        worldPos[0],
        worldPos[1],
        worldPos[2],
      ];

      const updatedPosition = <Types.Point3>[
        updatedFocalPoint[0] + distance * viewPlaneNormal[0],
        updatedFocalPoint[1] + distance * viewPlaneNormal[1],
        updatedFocalPoint[2] + distance * viewPlaneNormal[2],
      ];

      magnifyViewport.setCamera({
        parallelScale: parallelScale * (1 / this.configuration.magnifySize),
        focalPoint: updatedFocalPoint,
        position: updatedPosition,
      });
      magnifyViewport.render();
    });

    magnifyToolElement.style.display = 'block';
    triggerAnnotationRenderForViewportIds(viewportIdsToRender);

  };

}

import {
  VolumeViewport,
} from '@cornerstonejs/core';
const {drawHandles ,drawHandle,drawTextBox ,drawLinkedTextBox} = cornerstoneTools.drawing;

class PointInfoTool extends  ProbeTool {
  static toolName ;

  constructor(props) {
    super(props)

  }
  renderAnnotation = (
    enabledElement: Types.IEnabledElement,
    svgDrawingHelper
  ): boolean =>{
    let renderStatus = false;
    const { viewport } = enabledElement;
    const { element } = viewport;

    let annotations = annotation.state.getAnnotations(this.getToolName(), element);

    if (!annotations?.length) {
      return renderStatus;
    }

    annotations = this.filterInteractableAnnotationsForElement(
      element,
      annotations
    );

    if (!annotations?.length) {
      return renderStatus;
    }

    const targetId = this.getTargetId(viewport);
    const renderingEngine = viewport.getRenderingEngine();

    const styleSpecifier  = {
      toolGroupId: this.toolGroupId,
      toolName: this.getToolName(),
      viewportId: enabledElement.viewport.id,
    };

    for (let i = 0; i < annotations.length; i++) {
      const annotation = annotations[i]  ;
      const annotationUID = annotation.annotationUID;
      const data = annotation.data;
      const point = data.handles.points[0];
      const canvasCoordinates = viewport.worldToCanvas(point);

      styleSpecifier.annotationUID = annotationUID;

      const { color } = this.getAnnotationStyle({ annotation, styleSpecifier });

      if (!data.cachedStats) {
        data.cachedStats = {};
      }

      if (
        !data.cachedStats[targetId] ||
        data.cachedStats[targetId].value === null
      ) {
        data.cachedStats[targetId] = {
          Modality: null,
          index: null,
          value: null,
        };

        this._calculateCachedStats(
          annotation,
          renderingEngine,
          enabledElement,
          ChangeTypes.StatsUpdated
        );
      } else if (annotation.invalidated) {
        this._calculateCachedStats(annotation, renderingEngine, enabledElement);

        if (viewport instanceof VolumeViewport) {
          const { referencedImageId } = annotation.metadata;

          for (const targetId in data.cachedStats) {
            if (targetId.startsWith('imageId')) {
              const viewports = renderingEngine.getStackViewports();

              const invalidatedStack = viewports.find((vp) => {
                const referencedImageURI =
                  csUtils.imageIdToURI(referencedImageId);
                const hasImageURI = vp.hasImageURI(referencedImageURI);
                const currentImageURI = csUtils.imageIdToURI(
                  vp.getCurrentImageId()
                );
                return hasImageURI && currentImageURI !== referencedImageURI;
              });

              if (invalidatedStack) {
                delete data.cachedStats[targetId];
              }
            }
          }
        }
      }

      if (!viewport.getRenderingEngine()) {
        console.warn('Rendering Engine has been destroyed');
        return renderStatus;
      }

      const handleGroupUID = '0';

      drawHandle(
        svgDrawingHelper,
        annotationUID,
        handleGroupUID,
        canvasCoordinates,
        { color ,handleRadius:'2',fill:'red',opacity:1},
        '0'
      );

      renderStatus = true;

      const options = this.getLinkedTextBoxStyle(styleSpecifier, annotation);
      if (!options.visibility) {
        continue;
      }

      const textLines = this.configuration.getTextLines(data, targetId);
      const textcanvasCoordinates = viewport.worldToCanvas([point[0],point[1] ,point[2]]);

      if (textLines) {
        const textUID = '0';
        drawTextBox(
          svgDrawingHelper,
          annotationUID,
          textUID,
          textLines,
          [textcanvasCoordinates[0]+12,textcanvasCoordinates[1]-12],
          {padding:0,color},
        );

      }
    }

    return renderStatus;

  }


}
CircularMagnifyTool.toolName = 'CircularMagnify';
PointInfoTool.toolName = 'PointInfo'
export  {CircularMagnifyTool,PointInfoTool};
