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
    // Use a different API endpoint or service for fetching stock data
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=YOUR_FINNHUB_API_KEY` // Replace with your actual API key
    );

    if (!response.ok) {
      console.error('Failed to fetch stock info:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data) {
      return {
        symbol: symbol,
        name: symbol, // name is not directly available in this API response, so using symbol as a placeholder
        price: data.c, // current price
        changePercent: data.dp, // percentage change
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching stock info:', error);
    return null;
  }
}
