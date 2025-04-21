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
  /**
   * The percentage change in price since the previous close.
   */
  changePercent: number;
}

/**
 * Asynchronously retrieves stock information for a given symbol.
 *
 * @param symbol The stock symbol to retrieve information for.
 * @returns A promise that resolves to a Stock object containing stock information.
 */
export async function getStockInfo(symbol: string): Promise<Stock | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
    );
    const data = await response.json();

    if (data.quoteResponse.result.length > 0) {
      const quote = data.quoteResponse.result[0];
      return {
        symbol: quote.symbol,
        name: quote.longName || quote.shortName || quote.symbol,
        price: quote.regularMarketPrice,
        changePercent: quote.regularMarketChangePercent,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching stock info:', error);
    return null;
  }
}
