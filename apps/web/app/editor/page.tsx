import { EditorPanels } from "./_components/panels";
import { cookies } from "next/headers";

export default function Page() {
  const defaultLayout = cookies().get("recall:editor-layout")
    ? JSON.parse(cookies().get("recall:editor-layout")?.value ?? "[25, 75]")
    : [25, 75];

  return <EditorPanels defaultLayout={defaultLayout} />;
}
