import { useArkitekt } from "./provider";

export const useService = (key: string) => {
  const { app } = useArkitekt();

  return app.services[key];
};

const useRekuest = () => {
  const rekuest = useService("rekuest");

  return rekuest;
};

const withRekuest = (query: any) => {
  return (variables: any) => {
    const rekuest = useRekuest();

    return rekuest.client.query({
      query,
      variables,
    });
  };
};
