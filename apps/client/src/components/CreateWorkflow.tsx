import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type FinalConnectionState,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from "./TriggerSheet";
import { ActionSheet } from "./ActionSheet";
import { Hyperliquid } from "@/nodes/actions/Hyperliquid";
import { Backpack } from "@/nodes/actions/BackPack";
import type { PriceTriggerMetadata, TimerNodeMetadata, TradingMetaData } from "common/types";
import { PriceTrigger } from "@/nodes/triggers/PriceTrigger";
import { Timer } from "@/nodes/triggers/Timer";
import { Lighter } from "@/nodes/actions/Lighter";

export type NodeMetaData =
  | TradingMetaData
  | PriceTriggerMetadata
  | TimerNodeMetadata;

const nodeTypes = {
  "price-trigger": PriceTrigger,
  timer: Timer,
  lighter: Lighter,
  hyperliquid: Hyperliquid,
  backpack: Backpack,
};

export type NodeKind =
  | "price-trigger"
  | "timer"
  | "hyperliquid"
  | "backpack"
  | "lighter";

interface NodeType {
  type: NodeKind;
  data: {
    kind: "action" | "trigger";
    metaData: NodeMetaData;
  };
  id: string;
  position: {
    x: number;
    y: number;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export default function CreateWorkflow() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectAction, setSelectAction] = useState<{
    position: {
      x: number;
      y: number;
    };
    startingNodeId: string;
  } | null>(null);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<NodeType, Edge> | null>(null);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const onConnectionEnd = useCallback(
    (_params: any, connectionState: FinalConnectionState) => {
      console.log(connectionState);

      if (
        !connectionState.isValid &&
        connectionState.fromNode &&
        connectionState.to && rfInstance
      ) {
        // if connection arrow drops on empty space create a new node there
        const flowPosition = rfInstance.screenToFlowPosition({
          x: connectionState.to.x,
          y: connectionState.to.y,
        });
        setSelectAction({
          startingNodeId: connectionState.fromNode.id,
          position: {
            x: flowPosition.x,
            y: flowPosition.y,
          },
        });
      }
    },
    [rfInstance]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!nodes.length && (
        <TriggerSheet
          onSelect={(kind, metaData) =>
            setNodes([
              ...nodes,
              {
                id: Math.random().toString(),
                type: kind,
                data: {
                  kind: "trigger",
                  metaData: metaData,
                },
                position: {
                  x: 0,
                  y: 0,
                },
              },
            ])
          }
        />
      )}
      {selectAction && (
        <ActionSheet
          onSelect={(kind, metaData) => {
            const nodeId = Math.random().toString();
            setNodes([
              ...nodes,
              {
                id: nodeId,
                type: kind,
                data: {
                  kind: "action",
                  metaData: metaData,
                },
                position: {
                  x: selectAction.position.x,
                  y: selectAction.position.y,
                },
              },
            ]);
            setEdges([
              ...edges,
              {
                id: `${selectAction.startingNodeId}-${nodeId}`,
                source: selectAction.startingNodeId,
                target: nodeId,
              },
            ]);
            setSelectAction(null);
          }}
        />
      )}
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onInit={setRfInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectionEnd}
        fitView
      />
    </div>
  );
}
