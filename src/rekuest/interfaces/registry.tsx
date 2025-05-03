import {
  Descriptor,
  InterfaceProps,
  ActionRequirements,
  StateRequirements,
} from "./types";

export class InterfaceRegistry {
  descriptors: { [key: string]: Descriptor<any, any> };
  components: {
    [key: string]: (props: InterfaceProps<any, any>) => React.ReactNode;
  };

  constructor() {
    this.descriptors = {};
    this.components = {};
  }

  registerPackage = (des: Descriptor<any, any>) => {
    this.descriptors[des.name] = des;
  };

  getDescriptor(name) {
    return this.descriptors[name];
  }

  getComponent(name) {
    return this.components[name];
  }

  getDescriptors() {
    return Object.values(this.descriptors);
  }
}
