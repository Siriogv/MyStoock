/**
 * Represents stock information.
 */
export interface Stock {
  /**
   * The stock symbol.
   */
  symbol: string;
  /**
   * The name of the company.
   */
  name: string;
  /**
   * The current price of the stock.
   */
  price: number;
}

/**
 * Asynchronously retrieves stock information for a given symbol.
 *
 * @param symbol The stock symbol to retrieve information for.
 * @returns A promise that resolves to a Stock object containing stock information.
 */
export async function getStockInfo(symbol: string): Promise<Stock> {
  // TODO: Implement this by calling an API.

  return {
    symbol: symbol,
    name: 'Example Company',
    price: 100,
  };
}
