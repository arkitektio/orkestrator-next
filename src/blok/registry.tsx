import { MetaApplicationAdds } from "@/hooks/use-metaapp";
import { Camera, CameraModule } from "./modules/Camera";
import { IlluminationModule, Illuminator } from "./modules/Illumination";
import {
  Positioner,
  PositionerModule,
  PositionerPlaceholder,
} from "./modules/Positioner";
import {
  StageController,
  StageControllerModule,
} from "./modules/StageController";
import TurretWidget, { TurretModule } from "./modules/Turret";

export type Registration = {
  name: string;
  module: MetaApplicationAdds<any>;
  component: React.ComponentType;
  placeholder: React.ComponentType;
};

export class Registry {
  modules: Map<string, MetaApplicationAdds<any>>;
  components: Map<string, Registration>;

  constructor() {
    this.modules = new Map();
    this.components = new Map();
  }

  register(register: Registration) {
    this.modules.set(register.module.app.name, register.module);
    this.components.set(register.module.app.name, register);
  }

  getModule(name: string) {
    return this.modules.get(name);
  }

  getComponent(name: string) {
    return this.components.get(name);
  }
}

const registry = new Registry();

registry.register({
  name: "StageControl",
  module: StageControllerModule,
  component: StageController,
  placeholder: PositionerPlaceholder,
});

registry.register({
  name: "Turret",
  module: TurretModule,
  component: TurretWidget,
  placeholder: PositionerPlaceholder,
});

registry.register({
  name: "Camera",
  module: CameraModule,
  component: Camera,
  placeholder: PositionerPlaceholder,
});

registry.register({
  name: "Positioner",
  module: PositionerModule,
  component: Positioner,
  placeholder: PositionerPlaceholder,
});

registry.register({
  name: "Illuminator",
  module: IlluminationModule,
  component: Illuminator,
  placeholder: PositionerPlaceholder,
});

export default registry;
