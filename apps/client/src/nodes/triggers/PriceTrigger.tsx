import { Handle, Position } from "@xyflow/react";
import type { PriceTriggerMetadata } from "common/types";

export const PriceTrigger = ({
  data,
}: {
  data: {
    metadata: PriceTriggerMetadata;
  };
  isConnectable: boolean;
}) => {
  return (
    <div className="p-4 border shadow-sm rounded-md">
      <span className="font-semibold">{data.metadata.asset}</span> ${data.metadata.price}
      <Handle position={Position.Right} type="source"></Handle>
    </div>
  );
};
