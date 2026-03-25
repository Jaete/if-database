import { ReactNode } from "react";
import { useCssHandles } from "@/hooks/useCssHandles";
import CreatureDrawerHandles from "../handles";

const DrawerContent = ({ children }: { children: ReactNode }) => {
  const handles = useCssHandles(CreatureDrawerHandles);

  return <div className={handles.drawerContent}>{children}</div>;
};

export default DrawerContent