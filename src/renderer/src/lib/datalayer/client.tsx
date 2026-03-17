export type LivekitClient = {
  url: string;
};

export type LivekitConfig = {
  url: string;
};

export const createDatalayerClient = (config: LivekitConfig) => {
  return {
    url: config.url,
  };
};
