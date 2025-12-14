export const SUPPORTED_ASSETS = ["SOL", "BTC", "ETH", "USDC"];

export type TradingMetaData = {
  type: "LONG" | "SHORT";
  qty: number;
  symbol: typeof SUPPORTED_ASSETS;
};

export type PriceTriggerMetadata = {
  asset: string;
  price: number;
};

export type TimerNodeMetadata = {
  time: number;
};
