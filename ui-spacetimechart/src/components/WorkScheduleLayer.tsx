import React, { useEffect, useState } from "react";

import { getParallelogramKeyUtils, ParallelogramReact, PatternRect } from "./PatternRect";
import {
  isValidWsParallelogram,
  isValidWsSquare,
  ParallelogramPosition,
  type WorkSchedule,
  type WsGeometry
} from "../types";

type WorkScheduleLayerProps = {
  workSchedules: WorkSchedule<WsGeometry>[];
  imageUrl: string;
};

/**
 * Displays the workschedule projection on the Space time chart.
 * A workschedule has a start time and an end time.
 * It can contain several portions of a track occupied during this period.
 * Each portion is represented by a rectangle region
 */
export const WorkScheduleLayer = ({ workSchedules, imageUrl }: WorkScheduleLayerProps) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement>();
  useEffect(() => {
    if (imageUrl) {
      const newImage = new Image();
      newImage.src = imageUrl;
      newImage.onload = () => {
        setImageElement(newImage);
      };
    }
  }, [imageUrl]);

  if (!imageElement) {
    return null;
  }

  return workSchedules.flatMap((ws: WorkSchedule<WsGeometry>) => {
    if (isValidWsSquare(ws)) {
      return ws.spaceRanges.map(([spaceStart, spaceEnd]) => (
        <PatternRect
          key={`${ws.type}-${ws.timeStart}-${ws.timeEnd}-${spaceStart}-${spaceEnd}`}
          timeStart={ws.timeStart}
          timeEnd={ws.timeEnd}
          spaceStart={spaceStart}
          spaceEnd={spaceEnd}
          imageElement={imageElement}
        />
      ));
    } else if (isValidWsParallelogram(ws)) {
      const key: string = getParallelogramKeyUtils(ws);
      return (
        <ParallelogramReact
          key={key}
          position1={ws.spaceTimePoints[0]}
          position2={ws.spaceTimePoints[1]}
          position3={ws.spaceTimePoints[2]}
          position4={ws.spaceTimePoints[3]}
          imageElement={imageElement}
        />
      );
    } else {
      console.error("WorkScheduleLayer Error: Invalid workSchedules");
    }
  });
};
