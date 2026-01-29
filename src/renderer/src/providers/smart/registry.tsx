import { Option } from "@/components/fields/ListSearchField";
import { DisplayWidgetProps } from "@/lib/display/registry";

export type SearchFunction = (search: string) => Promise<Option[]>;

export type Registration = {
  identifier: string;
  description?: string;
  path: string;
  search?: SearchFunction;
  diplayWidget?: React.ComponentType<DisplayWidgetProps>;
};

export class SmartRegistry {
  private registry: Map<string, Registration> = new Map<string, Registration>();

  public constructor() {
    this.registry = new Map<string, Registration>();
  }

  register(registration: Registration) {
    this.registry.set(registration.identifier, registration);
  }

  registeredModels(): Registration[] {
    const registrations = Array.from(this.registry.values());
    console.log(registrations);
    return registrations;
  }

  findModel(identifier: string): Registration | undefined {
    return this.registry.get(identifier);
  }

  getModelPath(identifier: string): string | undefined {
    const model = this.findModel(identifier);
    return model?.path;
  }

  buildModelPath(identifier: string, id: string): string | undefined {
    const model = this.findModel(identifier);
    if (!model) return undefined;
    return `${model.path}/${id}`;
  }
}

export const smartRegistry = new SmartRegistry();

export const useModels = (search?: string) => {
  return smartRegistry
    .registeredModels()
    .filter(
      (predicate) =>
        search == undefined ||
        search == "" ||
        predicate.identifier.includes(search),
    );
};
