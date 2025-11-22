import { DefinitionInput } from "./schemas/rekuest";
import { ElectronAgentFunction, ElectronAssignContext, InferDefinition } from "./agent-types";

export type RegistryEntry = {
    name: string;
    func: ElectronAgentFunction<any>;
    definition: DefinitionInput;
}

class ElectronAgentRegistry {
    entries: RegistryEntry[] = [];

    register<const D extends DefinitionInput, R extends Record<string, unknown> = Record<string, unknown>>(
        name: string,
        func: ElectronAgentFunction<ElectronAssignContext<InferDefinition<D>, R>>,
        definition: D,
    ) {
        this.entries.push({ name, func, definition });
    }
}

export const electronRegistry = new ElectronAgentRegistry();
