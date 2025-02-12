import { Option } from "@/components/fields/ListSearchField";



export type SearchFunction = (search: string) => Promise<Option[]>;
export type Registration = {
    identifier: string;
    description?: string;
    path: string;
    search?: SearchFunction;
};

export class SmartRegistry {
    private registry: Map<string, Registration> = new Map<string, Registration>();

    public constructor() {
        this.registry = new Map<string, Registration>();
    }


    register(registration: Registration) {
        console.log("Registering", registration);
        this.registry.set(registration.identifier, registration);
    }

    registeredModels(): Registration[] {
        let registrations = Array.from(this.registry.values());
        console.log(registrations);
        return registrations;
    }



}



export const smartRegistry = new SmartRegistry();



export const useModels = (search?: string) => {
    return smartRegistry.registeredModels().filter(predicate => search == undefined || search == "" || predicate.identifier.includes(search));
}