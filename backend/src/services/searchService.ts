import natural from 'natural';

const TfIdf = natural.TfIdf;

export class SearchService {
  private tfidf: any;

  constructor() {
    this.tfidf = new TfIdf();
  }

  /**
   * Index documents for BM25 search
   */
  indexDocuments(documents: Array<{ id: number; text: string }>) {
    documents.forEach((doc) => {
      this.tfidf.addDocument(doc.text);
    });
  }

  /**
   * Search documents using BM25 algorithm
   */
  search(query: string, limit = 10): Array<{ index: number; score: number }> {
    const results: Array<{ index: number; score: number }> = [];

    this.tfidf.tfidfs(query, (i: number, measure: number) => {
      if (measure > 0) {
        results.push({ index: i, score: measure });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate semantic similarity between two texts
   * This is a simplified version - in production, you'd use embeddings
   */
  calculateSimilarity(text1: string, text2: string): number {
    const tokenizer = new natural.WordTokenizer();
    const tokens1 = new Set(tokenizer.tokenize(text1.toLowerCase()));
    const tokens2 = new Set(tokenizer.tokenize(text2.toLowerCase()));

    const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);

    return intersection.size / union.size;
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text: string, limit = 10): string[] {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase()) || [];

    // Remove stop words and short words
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    const filtered = tokens.filter(
      (token) => token.length > 3 && !stopWords.has(token)
    );

    // Count frequencies
    const frequencies: Record<string, number> = {};
    filtered.forEach((token) => {
      frequencies[token] = (frequencies[token] || 0) + 1;
    });

    // Sort by frequency
    return Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }
}

export const searchService = new SearchService();
