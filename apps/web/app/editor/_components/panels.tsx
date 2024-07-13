"use client";

import React, { useCallback } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@recall/ui";
import { saveLayout } from "@/lib/cookies";
import { Editor } from "@recall/code-editor";
import Canvas from "./editor-canvas/canvas";

const SidebarPanel = () => (
  <div className="h-full bg-gray-100 overflow-auto">
    <Editor />
  </div>
);

const MainPanel = () => (
  <div className="h-full bg-gray-200">
    <Canvas
      database={{
        tables: [
          {
            name: "users",
            position: { x: 100, y: 100 },
            columns: [
              { name: "id", type: "integer" },
              { name: "name", type: "string" },
            ],
          },
          {
            name: "posts",
            position: { x: 300, y: 100 },
            columns: [
              { name: "id", type: "integer" },
              { name: "title", type: "string" },
              { name: "content", type: "text" },
            ],
          },
        ],

        relations: [{ type: "one-to-many", from: "users", to: "posts" }],
      }}
    />
  </div>
);

export const EditorPanels = ({
  defaultLayout,
}: {
  defaultLayout: [number, number];
}) => {
  const handleLayoutChange = useCallback((layout: number[]) => {
    saveLayout("recall:editor-layout", layout);
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full"
      autoSaveId={"recall:editor-layout"}
      onLayout={handleLayoutChange}
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={10}>
        <SidebarPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={20}>
        <MainPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
