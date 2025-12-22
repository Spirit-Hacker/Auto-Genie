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
import {
  SUPPORTED_ASSETS,
  type PriceTriggerMetadata,
  type TimerNodeMetadata,
} from "common/types";
import { getNodes, type NodesResponse } from "@/lib/http";

const SUPPORTED_TRIGGERS = [
  {
    id: "timer",
    title: "Timer Trigger",
    description: "Run this trigger every x seconds/minutes",
  },
  {
    id: "price-trigger",
    title: "Price Trigger",
    description:
      "Runs whenever the price goes above or below a certain number for an asset",
  },
];

export const TriggerSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetaData, nodeId: string) => void;
}) => {
  const [metadata, setMetadata] = useState<
    PriceTriggerMetadata | TimerNodeMetadata
  >({
    time: 3600,
  });
  const [selectedTrigger, setSelectedTrigger] = useState<NodeKind>("timer");
  const [nodeId, setNodeId] = useState("");

  const [triggerNodes, setTriggerNodes] = useState<NodesResponse | null>(null);
  const allNodes = async () => {
    const res = await getNodes();
    console.log("Nodes Res: ", res);
    const trigger = res.filter((node) => node.type === "TRIGGER");
    setTriggerNodes({ nodes: trigger });
  };
  useEffect(() => {
    allNodes();
  }, []);

  useEffect(() => {
    console.log("TriggerNodes: ", triggerNodes);
    const node = triggerNodes?.nodes.find((n) => n.id === selectedTrigger)!;
    console.log("Selected Node: ", node);
    setNodeId(node?._id);
  }, [triggerNodes, selectedTrigger]);
  return (
    <div>
      <Sheet open={true}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select Trigger</SheetTitle>
            <SheetDescription>
              Select the type of trigger that you need.
              <Select
                value={selectedTrigger}
                onValueChange={(value: NodeKind) => setSelectedTrigger(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {triggerNodes &&
                      triggerNodes.nodes.map((node) => (
                        <>
                          <SelectItem key={node.id} value={node.id}>
                            {node.title}
                          </SelectItem>
                        </>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedTrigger === "timer" && (
                <div>
                  <div className="pt-4">
                    Number of seconds to after which to run the timer
                  </div>
                  <Input
                    value={metadata.time}
                    type="text"
                    onChange={(e) =>
                      setMetadata((m) => ({
                        ...m,
                        time: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              )}
              {selectedTrigger === "price-trigger" && (
                <div className="pt-4">
                  Price:
                  <Input
                    type="text"
                    onChange={(e) =>
                      setMetadata((m) => ({
                        ...m,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                  Asset:
                  <Select
                    value={metadata.asset}
                    onValueChange={(value) =>
                      setMetadata((metadata) => ({
                        ...metadata,
                        asset: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an asset" />
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
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button
              onClick={() => {
                onSelect(selectedTrigger, metadata, nodeId);
              }}
              type="submit"
            >
              Create Trigger
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
