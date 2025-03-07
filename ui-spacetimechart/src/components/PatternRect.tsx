import { useCallback } from "react";

import { useDraw } from "../hooks/useCanvas";
import { type DrawingFunction } from "../lib/types";
import { ParallelogramPosition, ParallelogramStyle, WorkSchedule, WsParallelogramPositions } from "../types";

export type PatternRectProps = {
  timeStart: Date;
  timeEnd: Date;
  spaceStart: number; // mm
  spaceEnd: number; // mm
  imageElement: HTMLImageElement;
};

/**
 * draws a repeating pattern in the space time chart
 *
 * @param {PatternRectProps} props
 * @returns {null | undefined}
 */
export const PatternRect = ({
                              timeStart,
                              timeEnd,
                              spaceStart,
                              spaceEnd,
                              imageElement
                            }: PatternRectProps) => {
  const drawRegion = useCallback<DrawingFunction>(
    (ctx, { getSpacePixel, getTimePixel, spaceAxis }) => {
      const timeStartPixel = getTimePixel(Number(timeStart));
      const endTimePixel = getTimePixel(Number(timeEnd));
      const spaceStartPixel = getSpacePixel(spaceStart);
      const spaceEndPixel = getSpacePixel(spaceEnd);

      const areaSpaceSize = spaceEndPixel - spaceStartPixel;
      const areaTimeSize = endTimePixel - timeStartPixel;
      if (!areaSpaceSize || !areaTimeSize) return;

      const pattern = ctx.createPattern(imageElement, 'repeat');
      if (!pattern) {
        return;
      }

      ctx.save();
      ctx.fillStyle = pattern;
      if (spaceAxis === 'x') {
        ctx.translate(spaceStartPixel, timeStartPixel);
        ctx.fillRect(0, 0, areaSpaceSize, areaTimeSize);
      } else {
        ctx.translate(timeStartPixel, spaceStartPixel);
        ctx.fillRect(0, 0, areaTimeSize, areaSpaceSize);
      }
      ctx.restore();
    },
    [timeStart, timeEnd, spaceStart, spaceEnd, imageElement]
  );
  useDraw('background', drawRegion);

  return null;
};

export type ParrallelogramRectProps = {
  position1: ParallelogramPosition;
  position2: ParallelogramPosition;
  position3: ParallelogramPosition;
  position4: ParallelogramPosition;
  style: ParallelogramStyle;
};

/**
 * Draws a parallelogram in the space time chart
 * Position correspond to each point of the parallelogram
 *
 *      position1   ________ position2
 *                /        /
 *     position4 /________/ position3
 *
 * @param {ParrallelogramRectProps} props
 * @returns {null}
 */
export const ParallelogramReact = ({ position1, position2, position3, position4, style }: ParrallelogramRectProps) => {
  const drawRegion = useCallback<DrawingFunction>(
    (ctx, { getSpacePixel, getTimePixel, spaceAxis }) => {
      ctx.save();

      ctx.fillStyle = style.backgroundColor || 'blue';
      ctx.stroke = style.borderColor || 'blue';

      ctx.beginPath();
      ctx.moveTo(
        getTimePixel(Number(position1.xPositionTime)),
        getSpacePixel(position1.yPositionSpace)
      );
      ctx.lineTo(
        getTimePixel(Number(position2.xPositionTime)),
        getSpacePixel(position2.yPositionSpace)
      );
      ctx.lineTo(
        getTimePixel(Number(position3.xPositionTime)),
        getSpacePixel(position3.yPositionSpace)
      );
      ctx.lineTo(
        getTimePixel(Number(position4.xPositionTime)),
        getSpacePixel(position4.yPositionSpace)
      );
      ctx.closePath();
      ctx.fill();
      // TODO: Prevent background from moving on drag&drop => maybe use "ctx.fillRect(x, y, width, height)" instead of ctx.fill()
      ctx.restore();
    },
    [position1, position2, position3, position4, style]
  );
  useDraw('background', drawRegion);

  return null;
};

/**
 * Get a string used to identify a WorkSchedule parallelogram
 * Position correspond to each point of the parallelogram
 *
 * @param {WorkSchedule<WsParallelogramPositions>} ws
 * @returns {string}
 */
export const getParallelogramKeyUtils = (ws: WorkSchedule<WsParallelogramPositions>): string => {
  const points: ParallelogramPosition[] = ws.spaceTimePoints;
  return `${ws.type}
  -${points[0].xPositionTime}-${points[0].yPositionSpace}
  -${points[1].xPositionTime}-${points[1].yPositionSpace}
  -${points[2].xPositionTime}-${points[2].yPositionSpace}
  -${points[3].xPositionTime}-${points[3].yPositionSpace}`;
};
