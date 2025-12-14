import { Handle, Position } from "@xyflow/react";
import type { PriceTriggerMetadata } from "common/types";

export const PriceTrigger = ({
  data,
}: {
  data: {
    metaData: PriceTriggerMetadata;
  };
  isConnectable: boolean;
}) => {
  return (
    <div className="p-4 border">
      {data.metaData.asset} {data.metaData.price}
      <Handle position={Position.Right} type="source"></Handle>
    </div>
  );
};
