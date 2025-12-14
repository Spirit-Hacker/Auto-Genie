import { Handle, Position } from "@xyflow/react";
import type { TradingMetaData } from "common/types";

export const Lighter = ({
  data,
}: {
  data: {
    metaData: TradingMetaData;
  };
}) => {
  return (
    <div className="p-4 border shadow-sm rounded-md">
      <div className="font-semibold mb-3">Lighter Trade</div>
      <div className="text-gray-500">
        Type:{" "}
        <span className="font-semibold text-black">{data.metaData.type}</span>
      </div>
      <div className="text-gray-500">
        QTY:{" "}
        <span className="font-semibold text-black">{data.metaData.qty}</span>
      </div>
      <div className="text-gray-500">
        Asset:{" "}
        <span className="font-semibold text-black">{data.metaData.symbol}</span>
      </div>
      <Handle position={Position.Right} type="source"></Handle>
      <Handle position={Position.Left} type="target"></Handle>
    </div>
  );
};
