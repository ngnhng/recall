import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  useNodesState,
  useEdgesState,
  Controls,
  ControlButton,
  Background,
  useStoreApi,
  ReactFlowProvider,
  getConnectedEdges,
  OnSelectionChangeParams,
  NodeChange,
  getIncomers,
  getOutgoers,
  ReactFlowInstance,
  Edge,
  addEdge,
  Connection,
} from "reactflow";

import "reactflow/dist/style.css";
import { Database, Relation, Table } from "@/types/canvas";

type CanvasProps = {
  database: Database;
};

const Canvas = (props: CanvasProps) => {
  const {
    database: { tables, relations },
  } = props;
  const initialNodes: Node[] = tables.map(tableToNode);
  const initialEdges: Edge[] = relations.map(relationToEdge);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((els) => addEdge(params, els)),
    []
  );

  return (
    <div style={{ height: "100%" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

const tableToNode = (table: Table): Node => {
  return {
    id: table.name,
    type: "default",
    data: { label: table.name },
    position: table.position,
  };
};

const relationToEdge = (relation: Relation): Edge => {
  return {
    id: `${relation.from}-${relation.to}`,
    source: relation.from,
    target: relation.to,
    type: "smoothstep",
    animated: true,
  };
};

export default Canvas;
