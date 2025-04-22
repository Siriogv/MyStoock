export interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  market: string;
  capitalization: number;
  changePercent: number;
}
