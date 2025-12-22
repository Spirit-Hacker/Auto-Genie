import { Handle, Position } from "@xyflow/react";
import type { TradingMetaData } from "common/types";

export const Hyperliquid = ({
  data,
}: {
  data: {
    metadata: TradingMetaData;
  };
}) => {
  return (
    <div className="p-4 border shadow-sm rounded-md">
      <div className="font-semibold mb-3">Hyperliquid Trade</div>
      <div className="text-gray-500">
        Type:{" "}
        <span className="font-semibold text-black">{data.metadata.type}</span>
      </div>
      <div className="text-gray-500">
        QTY:{" "}
        <span className="font-semibold text-black">{data.metadata.qty}</span>
      </div>
      <div className="text-gray-500">
        Asset:{" "}
        <span className="font-semibold text-black">{data.metadata.symbol}</span>
      </div>
      <Handle position={Position.Right} type="source"></Handle>
      <Handle position={Position.Left} type="target"></Handle>
    </div>
  );
};
