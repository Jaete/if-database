import { ReactNode } from "react";
import { useCssHandles } from "@/hooks/useCssHandles";
import CreatureDrawerHandles from "./handles";

const CreatureDrawer = ({ children }: { children: ReactNode }) => {
  const handles = useCssHandles(CreatureDrawerHandles);

  return (
    <div id="creature-drawer" className={handles.drawer}>
      {children}
    </div>
  );
};

export default CreatureDrawer