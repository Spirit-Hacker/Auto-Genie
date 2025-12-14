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
import {
  SUPPORTED_ASSETS,
  type PriceTriggerMetadata,
  type TimerNodeMetadata,
} from "common/types";

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
  onSelect: (kind: NodeKind, metaData: NodeMetaData) => void;
}) => {
  const [metaData, setMetaData] = useState<
    PriceTriggerMetadata | TimerNodeMetadata
  >({
    time: 3600,
  });
  const [selectedTrigger, setSelectedTrigger] = useState(
    SUPPORTED_TRIGGERS[0].id
  );
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
                onValueChange={(value) => setSelectedTrigger(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SUPPORTED_TRIGGERS.map(({ id, title }) => (
                      <>
                        <SelectItem key={id} value={id}>
                          {title}
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
                    value={metaData.time}
                    type="text"
                    onChange={(e) =>
                      setMetaData((m) => ({
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
                      setMetaData((m) => ({
                        ...m,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                  Asset:
                  <Select
                    value={metaData.asset}
                    onValueChange={(value) =>
                      setMetaData((metaData) => ({
                        ...metaData,
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
                onSelect(selectedTrigger, metaData);
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
