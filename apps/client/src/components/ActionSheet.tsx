import type { NodeKind, NodeMetaData } from "./CreateWorkflow";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { SUPPORTED_ASSETS, type TradingMetaData } from "common/types";
import { getNodes, type NodesResponse } from "@/lib/http";

export const ActionSheet = ({
  onSelect,
}: {
  onSelect: (
    kind: NodeKind,
    metadata: NodeMetaData,
    apiKey: string,
    nodeId: string
  ) => void;
}) => {
  const [metadata, setMetadata] = useState<TradingMetaData | {}>({});
  const [selectedAction, setSelectedAction] = useState<NodeKind>("lighter");
  const [actionNodes, setActionNodes] = useState<NodesResponse | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [nodeId, setNodeId] = useState("");

  const allNodes = async () => {
    const res = await getNodes();
    console.log("Nodes Res: ", res);
    const action = res.filter((node) => node.type === "ACTION");
    setActionNodes({ nodes: action });
  };
  useEffect(() => {
    allNodes();
  }, []);

  useEffect(() => {
    console.log("ActionNodes: ", actionNodes);
    const node = actionNodes?.nodes.find((n) => n.id === selectedAction)!;
    console.log("Selected Action Node: ", node);
    setNodeId(node?._id);
  }, [actionNodes, selectedAction]);

  return (
    <div>
      <Sheet open={true}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select Action</SheetTitle>
            <SheetDescription>
              Select the type of action that you need.
              <Select
                value={selectedAction}
                onValueChange={(value: NodeKind) => setSelectedAction(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {actionNodes &&
                      actionNodes.nodes.map(({ id, title }) => (
                        <>
                          <SelectItem key={id} value={id}>
                            {title}
                          </SelectItem>
                        </>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {(selectedAction === "hyperliquid" ||
                selectedAction === "backpack" ||
                selectedAction === "lighter") && (
                <div className="pt-2">
                  <div>Type</div>
                  <Select
                    value={metadata.type}
                    onValueChange={(value) =>
                      setMetadata((metadata) => ({
                        ...metadata,
                        type: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type of action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={"LONG"}>LONG</SelectItem>
                        <SelectItem value={"SHORT"}>SHORT</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div>Symbol</div>
                  <Select
                    value={metadata.symbol}
                    onValueChange={(value) =>
                      setMetadata((metaData) => ({
                        ...metaData,
                        symbol: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select the asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {SUPPORTED_ASSETS.map((asset) => (
                          <>
                            <SelectItem key={asset} value={asset}>
                              {asset}
                            </SelectItem>
                          </>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div>QTY</div>
                  <Input
                    value={metadata.qty}
                    type="text"
                    onChange={(e) =>
                      setMetadata((m) => ({
                        ...m,
                        qty: Number(e.target.value),
                      }))
                    }
                  />
                  <div>API Key</div>
                  <Input
                    value={apiKey}
                    type="text"
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button
              onClick={() => {
                onSelect(selectedAction, metadata, apiKey, nodeId);
              }}
              type="submit"
            >
              Create Action
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
