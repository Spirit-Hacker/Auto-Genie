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
import { useState } from "react";
import { Input } from "./ui/input";
import { SUPPORTED_ASSETS, type TradingMetaData } from "common/types";

const SUPPORTED_ACTIONS = [
  {
    id: "hyperliquid",
    title: "Hyperliquid",
    description: "Place a trade on hyperliquid",
  },
  {
    id: "backpack",
    title: "Backpack",
    description: "Place a trade on backpack",
  },
  {
    id: "lighter",
    title: "Lighter",
    description: "Place a trade on lighter",
  },
];

export const ActionSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeKind, metaData: NodeMetaData) => void;
}) => {
  const [metaData, setMetaData] = useState<TradingMetaData | {}>({});
  const [selectedAction, setSelectedAction] = useState(SUPPORTED_ACTIONS[0].id);
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
                onValueChange={(value) => setSelectedAction(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SUPPORTED_ACTIONS.map(({ id, title }) => (
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
                    value={metaData.type}
                    onValueChange={(value) =>
                      setMetaData((metaData) => ({
                        ...metaData,
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
                    value={metaData.symbol}
                    onValueChange={(value) =>
                      setMetaData((metaData) => ({
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
                    value={metaData.qty}
                    type="text"
                    onChange={(e) =>
                      setMetaData((m) => ({
                        ...m,
                        qty: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button
              onClick={() => {
                onSelect(selectedAction, metaData);
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
