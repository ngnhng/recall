import { useCallback, useMemo, useState } from "react";
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
  BackgroundVariant,
} from "reactflow";

import "reactflow/dist/style.css";
import { Database, Relation, Table } from "@/types/canvas";
import { colors } from "@/constants/colors";

type CanvasProps = {
  database: Database;
};

const Canvas = (props: CanvasProps) => {
  const {
    database: { tables, relations },
  } = props;
  const initialNodes: Node[] = useMemo(() => tables.map(tableToNode), [tables]);
  const initialEdges: Edge[] = useMemo(
    () => relations.map(relationToEdge),
    [relations]
  );
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
          <Background id="1" gap={10} variant={BackgroundVariant.Lines} />
          <Background
            id="2"
            gap={100}
            color="#ccc"
            variant={BackgroundVariant.Lines}
          />
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
