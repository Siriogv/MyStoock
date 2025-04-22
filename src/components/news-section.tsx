"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
interface NewsArticle {
  title: string;
  link: string;
  source: string;
}

// Function to fetch news articles based on a query.
const fetchNews = async (query: string): Promise<NewsArticle[]> => {
  const apiKey = process.env.NEWS_API_KEY;
  // Check if the API key is set. If not, warn and return an empty array.
  if (!apiKey) {
    console.warn("NEWS_API_KEY is not set, skipping news loading.");
    throw new Error("NEWS_API_KEY is not set");
  }
  // Construct the URL for the API request.
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    // Check if the response is successful.
    if (!response.ok) {
      console.error(`Failed to fetch news for ${query}: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch news for ${query}: ${response.status} ${response.statusText}`);
    }
    // Parse the response as JSON.
    const data = await response.json();
    // Process and return articles if the status is 'ok' and articles exist.
    if (data.status === "ok" && data.articles) {
       return data.articles.map((article: any) => ({
        title: article.title,
        link: article.url,
        source: article.source.name,
      }));
    }
        throw new Error(`No articles found for ${query}`);
  } catch (error) {
    // Handle any errors during the fetch process.
    console.error(`Error fetching news for ${query}:`, error);
    throw error;
  }
};

export const NewsSection = () => {
  const [news, setNews] = useState<{ general: NewsArticle[], portfolio: NewsArticle[] }>({ general: [], portfolio: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [generalNews, ...portfolioNewsResults] = await Promise.all([fetchNews("finance"), ...['AAPL', 'MSFT'].map(fetchNews)]);
        const portfolioNews = portfolioNewsResults.flat();
        setNews({ general: generalNews, portfolio: portfolioNews });
      } catch (err) {
          setError('Failed to load news.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();    
  }, []);

  return (
    
      
        
          
        
          
          {isLoading && <p>{t("Loading news...")}</p>}
            {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <>
            {news.general.map((article, index) => (
                <a key={index} href={article.link} target="_blank" rel="noopener noreferrer" className={cn("block hover:bg-accent rounded-md p-2", index > 0 && "mt-2")}>
                <div className="font-medium">{article.title}</div>
                <div className="text-sm text-muted-foreground">{t("Source")}: {article.source}</div>
                </a>
            ))}
          </>
        )}            
          
        
      
      
        
          
          {isLoading && <p>{t("Loading news...")}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (
              <>
              {news.portfolio.length > 0 ? (
                <>
                  {news.portfolio.map((article, index) => (
                    <a key={index} href={article.link} target="_blank" rel="noopener noreferrer" className={cn("block hover:bg-accent rounded-md p-2", index > 0 && "mt-2")}>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-sm text-muted-foreground">{t("Source")}: {article.source}</div>
                  </a>
                  ))}
                </>
                  ) : (
                    <p>{t("No news found for your portfolio stocks.")}</p>
                  )}
              </>
            )}          
          
        
      
    
  );
};
