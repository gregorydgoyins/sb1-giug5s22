import { NavigateFunction } from 'react-router-dom';

interface LinkCheckResult {
  url: string;
  status: 'valid' | 'invalid' | 'external' | 'redirect' | 'slow';
  statusCode?: number;
  error?: string;
  responseTime?: number;
  redirectUrl?: string;
  accessibility?: {
    hasAltText: boolean;
    hasAriaLabel: boolean;
    isKeyboardAccessible: boolean;
  };
}

interface LinkValidationRule {
  pattern: RegExp;
  validator: (url: string) => boolean;
  description: string;
}

export class LinkChecker {
  private static instance: LinkChecker;
  private checkedLinks: Map<string, LinkCheckResult> = new Map();
  private validationRules: LinkValidationRule[] = [];
  private navigate?: NavigateFunction;

  // Known valid internal routes
  private validInternalRoutes = [
    '/',
    '/markets',
    '/market-index',
    '/price-trends',
    '/portfolio',
    '/trading',
    '/news',
    '/learn',
    '/research',
    '/navigation-test'
  ];

  // Known valid external domains
  private trustedDomains = [
    'images.unsplash.com',
    'unsplash.com',
    'github.com',
    'stackoverflow.com',
    'developer.mozilla.org'
  ];

  private constructor() {
    this.initializeValidationRules();
  }

  public static getInstance(): LinkChecker {
    if (!LinkChecker.instance) {
      LinkChecker.instance = new LinkChecker();
    }
    return LinkChecker.instance;
  }

  public setNavigateFunction(navigate: NavigateFunction): void {
    this.navigate = navigate;
  }

  private initializeValidationRules(): void {
    this.validationRules = [
      {
        pattern: /^\/news\/\d+$/,
        validator: (url: string) => {
          const id = url.split('/')[2];
          return parseInt(id) > 0 && parseInt(id) <= 100; // Assume max 100 news items
        },
        description: 'News article with valid ID'
      },
      {
        pattern: /^\/creator\/[A-Z]+$/,
        validator: (url: string) => {
          const symbol = url.split('/')[2];
          return symbol.length >= 2 && symbol.length <= 10;
        },
        description: 'Creator page with valid symbol'
      },
      {
        pattern: /^\/publisher\/[A-Z]+$/,
        validator: (url: string) => {
          const symbol = url.split('/')[2];
          return symbol.length >= 2 && symbol.length <= 10;
        },
        description: 'Publisher page with valid symbol'
      },
      {
        pattern: /^\/trading\/[a-zA-Z0-9-]+$/,
        validator: () => true, // All trading sub-routes are valid
        description: 'Trading sub-page'
      }
    ];
  }

  public async checkLink(url: string): Promise<LinkCheckResult> {
    try {
      // Check cache first
      if (this.checkedLinks.has(url)) {
        return this.checkedLinks.get(url)!;
      }

      const startTime = performance.now();
      let result: LinkCheckResult;

      // Check if it's an external link
      if (this.isExternalLink(url)) {
        result = await this.checkExternalLink(url);
      } else {
        result = await this.checkInternalLink(url);
      }

      result.responseTime = performance.now() - startTime;

      // Check if response time is slow
      if (result.responseTime > 3000) { // 3 seconds
        result.status = 'slow';
      }

      this.checkedLinks.set(url, result);
      return result;
    } catch (error) {
      const result: LinkCheckResult = { 
        url, 
        status: 'invalid',
        error: error instanceof Error ? error.message : String(error),
        responseTime: 0
      };
      this.checkedLinks.set(url, result);
      return result;
    }
  }

  private async checkExternalLink(url: string): Promise<LinkCheckResult> {
    try {
      // Validate URL format
      const urlObj = new URL(url);
      
      // Check if domain is trusted
      const isTrusted = this.trustedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );

      // For external links, we can't actually fetch them in a browser environment
      // So we'll simulate the check based on URL structure and trusted domains
      if (isTrusted) {
        return {
          url,
          status: 'external',
          statusCode: 200,
          accessibility: {
            hasAltText: true, // Assume trusted domains have good accessibility
            hasAriaLabel: true,
            isKeyboardAccessible: true
          }
        };
      } else {
        return {
          url,
          status: 'external',
          statusCode: 200,
          accessibility: {
            hasAltText: false, // Unknown domains might have issues
            hasAriaLabel: false,
            isKeyboardAccessible: true
          }
        };
      }
    } catch (error) {
      return {
        url,
        status: 'invalid',
        error: 'Invalid URL format'
      };
    }
  }

  private async checkInternalLink(url: string): Promise<LinkCheckResult> {
    // Check against known valid routes
    if (this.validInternalRoutes.includes(url)) {
      return {
        url,
        status: 'valid',
        statusCode: 200,
        accessibility: {
          hasAltText: true,
          hasAriaLabel: true,
          isKeyboardAccessible: true
        }
      };
    }

    // Check against validation rules for dynamic routes
    for (const rule of this.validationRules) {
      if (rule.pattern.test(url)) {
        const isValid = rule.validator(url);
        return {
          url,
          status: isValid ? 'valid' : 'invalid',
          statusCode: isValid ? 200 : 404,
          error: isValid ? undefined : `Invalid ${rule.description}`,
          accessibility: {
            hasAltText: isValid,
            hasAriaLabel: isValid,
            isKeyboardAccessible: true
          }
        };
      }
    }

    // Check for common patterns that might be redirects
    if (url.includes('/old/') || url.includes('/legacy/')) {
      return {
        url,
        status: 'redirect',
        statusCode: 301,
        redirectUrl: url.replace('/old/', '/').replace('/legacy/', '/'),
        accessibility: {
          hasAltText: false,
          hasAriaLabel: false,
          isKeyboardAccessible: true
        }
      };
    }

    // Unknown internal route
    return {
      url,
      status: 'invalid',
      statusCode: 404,
      error: 'Route not found',
      accessibility: {
        hasAltText: false,
        hasAriaLabel: false,
        isKeyboardAccessible: false
      }
    };
  }

  private isExternalLink(url: string): boolean {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  public async checkMultipleLinks(urls: string[]): Promise<LinkCheckResult[]> {
    const results = await Promise.all(
      urls.map(url => this.checkLink(url))
    );
    return results;
  }

  public async scanPageForLinks(html: string): Promise<string[]> {
    // In a real implementation, this would parse HTML and extract links
    // For now, we'll simulate finding common links
    const commonLinks = [
      '/',
      '/markets',
      '/portfolio',
      '/trading',
      '/news',
      '/learn',
      '/news/1',
      '/news/2',
      '/creator/TMFS',
      '/publisher/DCCP',
      'https://images.unsplash.com/photo-1234567890',
      'https://github.com/example/repo'
    ];

    return commonLinks;
  }

  public getResults(): LinkCheckResult[] {
    return Array.from(this.checkedLinks.values());
  }

  public getInvalidLinks(): LinkCheckResult[] {
    return Array.from(this.checkedLinks.values())
      .filter(result => result.status === 'invalid');
  }

  public getSlowLinks(): LinkCheckResult[] {
    return Array.from(this.checkedLinks.values())
      .filter(result => result.status === 'slow');
  }

  public getExternalLinks(): LinkCheckResult[] {
    return Array.from(this.checkedLinks.values())
      .filter(result => result.status === 'external');
  }

  public getAccessibilityIssues(): Array<{ url: string; issues: string[] }> {
    return Array.from(this.checkedLinks.values())
      .map(result => {
        const issues: string[] = [];
        if (result.accessibility) {
          if (!result.accessibility.hasAltText) issues.push('Missing alt text');
          if (!result.accessibility.hasAriaLabel) issues.push('Missing ARIA label');
          if (!result.accessibility.isKeyboardAccessible) issues.push('Not keyboard accessible');
        }
        return { url: result.url, issues };
      })
      .filter(item => item.issues.length > 0);
  }

  public generateReport(): {
    summary: {
      totalLinks: number;
      validLinks: number;
      invalidLinks: number;
      externalLinks: number;
      slowLinks: number;
      averageResponseTime: number;
    };
    details: LinkCheckResult[];
  } {
    const results = this.getResults();
    const responseTimes = results.filter(r => r.responseTime).map(r => r.responseTime!);
    
    return {
      summary: {
        totalLinks: results.length,
        validLinks: results.filter(r => r.status === 'valid').length,
        invalidLinks: results.filter(r => r.status === 'invalid').length,
        externalLinks: results.filter(r => r.status === 'external').length,
        slowLinks: results.filter(r => r.status === 'slow').length,
        averageResponseTime: responseTimes.length > 0 ? 
          responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0
      },
      details: results
    };
  }

  public clearCache(): void {
    this.checkedLinks.clear();
  }

  public addValidationRule(rule: LinkValidationRule): void {
    this.validationRules.push(rule);
  }

  public addTrustedDomain(domain: string): void {
    this.trustedDomains.push(domain);
  }
}