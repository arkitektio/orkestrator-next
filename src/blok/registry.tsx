import { MetaApplication } from "@/hooks/use-metaapp";
import {
  Positioner,
  PositionerModule,
  PositionerPlaceholder,
} from "./modules/Positioner";
import { IlluminationModule, Illuminator } from "./modules/Illumination";
import TurretWidget, { TurretModule } from "./modules/Turret";
import {
  StageController,
  StageControllerModule,
} from "./modules/StageController";
import { Camera, CameraModule } from "./modules/Camera";

export type Registration = {
  name: string;
  module: MetaApplication<any, any>;
  component: React.ComponentType;
  placeholder: React.ComponentType;
};

export class Registry {
  modules: Map<string, MetaApplication<any, any>>;
  components: Map<string, Registration>;

  constructor() {
    this.modules = new Map();
    this.components = new Map();
  }

  register(register: Registration) {
    this.modules.set(register.name, register.module);
    this.components.set(register.name, register);
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
registry.register({
  name: "Turret",
  module: TurretModule,
  component: TurretWidget,
  placeholder: PositionerPlaceholder,
});
registry.register({
  name: "StageControl",
  module: StageControllerModule,
  component: StageController,
  placeholder: PositionerPlaceholder,
});
registry.register({
  name: "Camera",
  module: CameraModule,
  component: Camera,
  placeholder: PositionerPlaceholder,
});

export default registry;
