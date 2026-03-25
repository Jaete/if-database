import { useCssHandles } from "@/hooks/useCssHandles";
import CreatureDrawerHandles from "../handles";

const DrawerHeader = () => {
  const handles = useCssHandles(CreatureDrawerHandles);

  return (
    <div className={handles.drawerHeaderBar}>
      <button className={handles.closeBtn}>×</button>
    </div>
  );
};

export default DrawerHeader