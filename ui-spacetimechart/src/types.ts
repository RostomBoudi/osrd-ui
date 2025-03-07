/**
 * WorkSchedule type can be used to either draw a square or a parallelogram
 */
export type WorkSchedule<T extends WsGeometry> = {
  type: 'TRACK' | 'CATENARY';
} & T;

export type WsGeometry = WsSquarePositions | WsParallelogramPositions;

export type WsSquarePositions = {
  timeStart: Date;
  timeEnd: Date;
  spaceRanges: [number, number][];
};

export type WsParallelogramPositions = {
  spaceTimePoints: [
    ParallelogramPosition,
    ParallelogramPosition,
    ParallelogramPosition,
    ParallelogramPosition,
  ];
};

export type ParallelogramPosition = {
  xPositionTime: Date;
  yPositionSpace: number;
};

export type ParallelogramStyle = {
  backgroundColor: string;
  borderColor: string;
  opacity: number;
};

/**
 * WorkSchedule parallelogram data validation
 *
 * @param {WorkSchedule<WsGeometry>} ws
 * @returns {ws is WorkSchedule<WsParallelogramPositions>}
 */
export function isValidWsParallelogram(ws: WorkSchedule<WsGeometry>): ws is WorkSchedule<WsParallelogramPositions> {
  return (ws as WorkSchedule<WsParallelogramPositions>)?.spaceTimePoints?.length === 4;
}

/**
 * WorkSchedule square data validation
 *
 * @param {WorkSchedule<WsGeometry>} ws
 * @returns {ws is WorkSchedule<WsSquarePositions>}
 */
export function isValidWsSquare(ws: WorkSchedule<WsGeometry>): ws is WorkSchedule<WsSquarePositions> {
  const wsCast: WorkSchedule<WsSquarePositions> = ws as WorkSchedule<WsSquarePositions>;
  return !!(wsCast.timeStart && wsCast.timeEnd && wsCast.spaceRanges.length);
}
