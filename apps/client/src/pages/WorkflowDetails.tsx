import { ActionSheet } from "@/components/ActionSheet";
import { nodeTypes, type NodeType } from "@/components/CreateWorkflow";
import { TriggerSheet } from "@/components/TriggerSheet";
import { getWorkflow, updateWorkflow } from "@/lib/http";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlow,
  type Edge,
  type FinalConnectionState,
  type ReactFlowInstance,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const WorkflowDetails = () => {
  const { workflowId } = useParams();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    NodeType,
    Edge
  > | null>(null);
  const [selectAction, setSelectAction] = useState<{
    position: { x: number; y: number };
    startingNodeId: string;
  } | null>(null);

  console.log("Current Workflow ID: ", workflowId);
  const fetchWorkflow = async () => {
    const res = await getWorkflow(workflowId!);
    console.log("Work flow res: ", res);
    setNodes(res.nodes);
    setEdges(res.edges);
  };

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
      if (
        !connectionState.isValid &&
        connectionState.fromNode &&
        connectionState.to &&
        rfInstance
      ) {
        const flowPosition = rfInstance.screenToFlowPosition({
          x: connectionState.to.x,
          y: connectionState.to.y,
        });

        setSelectAction({
          startingNodeId: connectionState.fromNode.id,
          position: flowPosition,
        });
      }
    },
    [rfInstance]
  );

  const handleUpdateWorkflow = async () => {
    if (workflowId) {
      const res = await updateWorkflow(workflowId!, {nodes, edges});
      console.log("Workflow created: ", res);
    }
  };

  useEffect(() => {
    if (workflowId) {
      fetchWorkflow();
    }
  }, [workflowId]);
  return (
    <div className="h-screen bg-linear-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            Update Workflow
          </h1>
          <p className="text-gray-400 text-sm">
            Update the selected workflow
          </p>
        </div>

        <button
          onClick={handleUpdateWorkflow}
          className="px-5 py-2 rounded bg-green-600 hover:bg-green-700 transition font-semibold"
        >
          Update
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[calc(100vh-88px)]">

        {selectAction && (
          <ActionSheet
            onSelect={(kind, metadata, apiKey, nodeId) => {
              const newNodeId = Math.random().toString();

              setNodes([
                ...nodes,
                {
                  id: newNodeId,
                  type: kind,
                  nodeId,
                  data: {
                    kind: "ACTION",
                    metadata,
                  },
                  position: selectAction.position,
                  credentials: { API_KEY: apiKey },
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
      </div>
    </div>
  );
};

export default WorkflowDetails;
