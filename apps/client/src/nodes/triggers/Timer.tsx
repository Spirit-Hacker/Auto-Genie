import { Handle, Position } from "@xyflow/react";
import type { TimerNodeMetadata } from "common/types";

export const Timer = ({
  data,
}: {
  data: {
    metaData: TimerNodeMetadata;
  };
  isConnectable: boolean;
}) => {
  return (
    <div className="p-4 border shadow-sm rounded-md">
      <div className="font-semibold">Timer</div>
      <div className="text-gray-500">
        Every <span className="text-black font-semibold">{data.metaData.time}</span> Seconds
      </div>
      <Handle position={Position.Right} type="source"></Handle>
    </div>
  );
};
