export const sleep = (ms: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getTimeout = (
  iteration: number,
  initial = 2000,
  min = 200,
  decayFactor = 0.7
) => {
  return Math.max(initial * Math.pow(decayFactor, iteration), min);
};
