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
import type {
  PriceTriggerMetadata,
  TimerNodeMetadata,
  TradingMetaData,
} from "common/types";
import { PriceTrigger } from "@/nodes/triggers/PriceTrigger";
import { Timer } from "@/nodes/triggers/Timer";
import { Lighter } from "@/nodes/actions/Lighter";
import { createWorkflow } from "@/lib/http";

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
    kind: "ACTION" | "TRIGGER";
    metadata: NodeMetaData;
  };
  nodeId: string;
  id: string;
  position: {
    x: number;
    y: number;
  };
  credentials?: {
    API_KEY: string;
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

  console.log("Nodes: ", nodes);
  console.log("Edges: ", edges);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    NodeType,
    Edge
  > | null>(null);

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
        connectionState.to &&
        rfInstance
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

  const handlePUblish = async () => {
    console.log("Hello Workflow");
    const res = await createWorkflow(nodes, edges);
    console.log("Create Workflow Response: ", res);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="p-32">
      {!nodes.length && (
        <TriggerSheet
          onSelect={(kind, metadata, nodeId) =>
            setNodes([
              ...nodes,
              {
                id: Math.random().toString(),
                type: kind,
                nodeId: nodeId,
                data: {
                  kind: "TRIGGER",
                  metadata: metadata,
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
          onSelect={(kind, metadata, apiKey, nodeId) => {
            const newNodeId = Math.random().toString();
            setNodes([
              ...nodes,
              {
                id: newNodeId,
                type: kind,
                nodeId: nodeId,
                data: {
                  kind: "ACTION",
                  metadata: metadata,
                },
                position: {
                  x: selectAction.position.x,
                  y: selectAction.position.y,
                },
                credentials: {
                  API_KEY: apiKey,
                },
              },
            ]);
            setEdges([
              ...edges,
              {
                id: `${selectAction.startingNodeId}-${newNodeId}`,
                source: selectAction.startingNodeId,
                target: newNodeId,
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

      <div
        className="bg-black text-white w-[100px] text-center cursor-pointer"
        onClick={handlePUblish}
      >
        Publish
      </div>
    </div>
  );
}
