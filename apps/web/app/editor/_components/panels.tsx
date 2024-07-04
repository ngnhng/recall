"use client";

import React, { useCallback } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@hikari/ui";
import { saveLayout } from "@/lib/cookies";
import { DbmlEditor } from "@hikari/dbml-editor";

const SidebarPanel = () => (
  <div className="h-full bg-gray-100 overflow-auto">
    <DbmlEditor />
  </div>
);

const MainPanel = () => <div className="h-full bg-gray-200">Main</div>;

export const EditorPanels = ({
  defaultLayout,
}: {
  defaultLayout: [number, number];
}) => {
  const handleLayoutChange = useCallback((layout: number[]) => {
    saveLayout("hikari:editor-layout", layout);
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full"
      autoSaveId={"hikari:editor-layout"}
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
