import { MetaApplication } from "@/hooks/use-metaapp";
import {
  Positioner,
  PositionerModule,
  PositionerPlaceholder,
} from "./Positioner";

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

export default registry;
