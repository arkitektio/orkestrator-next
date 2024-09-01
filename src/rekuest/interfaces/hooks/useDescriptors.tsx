import { registry } from "../instance";

export const useDescriptors = () => {
  return registry.getDescriptors();
};

export const useDescriptor = (name: string) => {
  return registry.getDescriptor(name);
};
