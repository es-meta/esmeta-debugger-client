export type Binding = [string, string | undefined];

export type ESEnv = Binding[];

export type ESContext = {
  // name: string;
  type: string;
  address: string;
};
