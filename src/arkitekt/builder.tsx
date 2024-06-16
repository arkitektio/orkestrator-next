export const buildApp = <T extends ServiceMap>(serviceMap: T): App<T> => {
  return {
    services: serviceMap,
    manifest: {
      name: "My App",
      version: "1.0.0",
      description: "My App Description",
    },
  };
};
