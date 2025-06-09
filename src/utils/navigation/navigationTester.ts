import { NavigateFunction } from 'react-router-dom';

interface NavigationTestResult {
  path: string;
  status: 'success' | 'error' | 'warning';
  error?: string;
  breadcrumbsPresent: boolean;
  childLinks: string[];
  loadTime?: number;
  accessibilityIssues: string[];
  responseCode?: number;
}

interface RouteConfig {
  path: string;
  component: string;
  requiresAuth?: boolean;
  expectedBreadcrumbs?: boolean;
  childRoutes?: string[];
  description?: string;
}

export class NavigationTester {
  private static instance: NavigationTester;
  private results: Map<string, NavigationTestResult> = new Map();
  private navigate?: NavigateFunction;
  private routeConfigs: RouteConfig[] = [
    {
      path: '/',
      component: 'Dashboard',
      expectedBreadcrumbs: false,
      childRoutes: ['/markets', '/portfolio', '/trading', '/news', '/learn'],
      description: 'Main dashboard with market overview'
    },
    {
      path: '/markets',
      component: 'Markets',
      expectedBreadcrumbs: true,
      childRoutes: ['/market-index', '/price-trends'],
      description: 'Market overview and analysis'
    },
    {
      path: '/market-index',
      component: 'ComicMarketIndexTrend',
      expectedBreadcrumbs: true,
      description: 'Comic market index with historical data'
    },
    {
      path: '/price-trends',
      component: 'ComicPriceTrends',
      expectedBreadcrumbs: true,
      description: 'Price trend analysis for key comics'
    },
    {
      path: '/portfolio',
      component: 'PortfolioOverview',
      expectedBreadcrumbs: true,
      childRoutes: ['/portfolio/positions', '/portfolio/transactions'],
      description: 'Portfolio management and tracking'
    },
    {
      path: '/trading',
      component: 'Trading',
      expectedBreadcrumbs: true,
      description: 'Trading interface and tools'
    },
    {
      path: '/news',
      component: 'News',
      expectedBreadcrumbs: true,
      childRoutes: ['/news/1', '/news/2', '/news/3'],
      description: 'Market news and updates'
    },
    {
      path: '/learn',
      component: 'Learn',
      expectedBreadcrumbs: true,
      description: 'Educational content and tutorials'
    },
    {
      path: '/research',
      component: 'ResearchReport',
      expectedBreadcrumbs: true,
      description: 'Market research and analysis reports'
    },
    {
      path: '/navigation-test',
      component: 'NavigationTestPage',
      expectedBreadcrumbs: true,
      description: 'Navigation system testing interface'
    }
  ];

  private constructor() {}

  public static getInstance(): NavigationTester {
    if (!NavigationTester.instance) {
      NavigationTester.instance = new NavigationTester();
    }
    return NavigationTester.instance;
  }

  public setNavigateFunction(navigate: NavigateFunction): void {
    this.navigate = navigate;
  }

  public async testNavigation(): Promise<NavigationTestResult[]> {
    try {
      this.results.clear();
      
      // Test each configured route
      for (const routeConfig of this.routeConfigs) {
        await this.testRoute(routeConfig);
      }

      // Test dynamic routes
      await this.testDynamicRoutes();

      return Array.from(this.results.values());
    } catch (error) {
      console.error('Navigation testing failed:', error);
      return [];
    }
  }

  private async testRoute(routeConfig: RouteConfig): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Simulate navigation test
      const testResult = await this.performRouteTest(routeConfig);
      const loadTime = performance.now() - startTime;

      this.results.set(routeConfig.path, {
        ...testResult,
        loadTime,
        path: routeConfig.path
      });

      // Test child routes if they exist
      if (routeConfig.childRoutes) {
        for (const childPath of routeConfig.childRoutes) {
          const childConfig = this.routeConfigs.find(r => r.path === childPath);
          if (childConfig && !this.results.has(childPath)) {
            await this.testRoute(childConfig);
          }
        }
      }
    } catch (error) {
      this.results.set(routeConfig.path, {
        path: routeConfig.path,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        breadcrumbsPresent: false,
        childLinks: [],
        accessibilityIssues: ['Route test failed']
      });
    }
  }

  private async performRouteTest(routeConfig: RouteConfig): Promise<Omit<NavigationTestResult, 'path' | 'loadTime'>> {
    // Simulate realistic testing scenarios
    const accessibilityIssues: string[] = [];
    let status: 'success' | 'error' | 'warning' = 'success';
    let error: string | undefined;

    // Check if route exists in our configuration
    const routeExists = this.routeConfigs.some(r => r.path === routeConfig.path);
    if (!routeExists && !routeConfig.path.includes(':')) {
      status = 'error';
      error = 'Route not found in configuration';
    }

    // Simulate breadcrumb checking
    const breadcrumbsPresent = this.checkBreadcrumbs(routeConfig);
    if (routeConfig.expectedBreadcrumbs && !breadcrumbsPresent) {
      accessibilityIssues.push('Expected breadcrumbs not found');
      status = status === 'success' ? 'warning' : status;
    }

    // Simulate accessibility checks
    const accessibilityChecks = this.performAccessibilityChecks(routeConfig);
    accessibilityIssues.push(...accessibilityChecks);

    // Get child links
    const childLinks = this.getChildLinks(routeConfig);

    // Simulate response time and status
    const responseCode = this.simulateResponseCode(routeConfig);
    if (responseCode >= 400) {
      status = 'error';
      error = `HTTP ${responseCode} error`;
    }

    return {
      status,
      error,
      breadcrumbsPresent,
      childLinks,
      accessibilityIssues,
      responseCode
    };
  }

  private checkBreadcrumbs(routeConfig: RouteConfig): boolean {
    // Simulate breadcrumb presence check
    if (routeConfig.path === '/') return false; // Home doesn't need breadcrumbs
    
    // Check if the route should have breadcrumbs based on depth
    const pathDepth = routeConfig.path.split('/').filter(Boolean).length;
    return pathDepth > 0 && routeConfig.expectedBreadcrumbs !== false;
  }

  private performAccessibilityChecks(routeConfig: RouteConfig): string[] {
    const issues: string[] = [];
    
    // Simulate common accessibility checks
    if (Math.random() < 0.1) { // 10% chance of missing alt text
      issues.push('Missing alt text on images');
    }
    
    if (Math.random() < 0.05) { // 5% chance of missing ARIA labels
      issues.push('Missing ARIA labels on interactive elements');
    }
    
    if (Math.random() < 0.03) { // 3% chance of color contrast issues
      issues.push('Insufficient color contrast ratio');
    }

    // Check for specific route issues
    if (routeConfig.path.includes('trading') && Math.random() < 0.15) {
      issues.push('Complex trading interface may need additional keyboard navigation');
    }

    return issues;
  }

  private getChildLinks(routeConfig: RouteConfig): string[] {
    return routeConfig.childRoutes || [];
  }

  private simulateResponseCode(routeConfig: RouteConfig): number {
    // Simulate realistic response codes
    if (routeConfig.path.includes('404') || routeConfig.path.includes('error')) {
      return 404;
    }
    
    if (routeConfig.requiresAuth && Math.random() < 0.1) {
      return 401; // Simulate auth issues
    }
    
    if (Math.random() < 0.02) { // 2% chance of server error
      return 500;
    }
    
    return 200; // Success
  }

  private async testDynamicRoutes(): Promise<void> {
    // Test dynamic routes like /news/:id
    const dynamicRoutes = [
      { path: '/news/1', parentPath: '/news' },
      { path: '/news/2', parentPath: '/news' },
      { path: '/creator/TMFS', parentPath: '/trading' },
      { path: '/publisher/DCCP', parentPath: '/trading' }
    ];

    for (const route of dynamicRoutes) {
      const routeConfig: RouteConfig = {
        path: route.path,
        component: 'DynamicComponent',
        expectedBreadcrumbs: true,
        description: `Dynamic route for ${route.path}`
      };

      await this.testRoute(routeConfig);
    }
  }

  public getResults(): NavigationTestResult[] {
    return Array.from(this.results.values());
  }

  public getFailedRoutes(): NavigationTestResult[] {
    return Array.from(this.results.values()).filter(result => result.status === 'error');
  }

  public getWarningRoutes(): NavigationTestResult[] {
    return Array.from(this.results.values()).filter(result => result.status === 'warning');
  }

  public getMissingBreadcrumbs(): NavigationTestResult[] {
    return Array.from(this.results.values())
      .filter(result => {
        const routeConfig = this.routeConfigs.find(r => r.path === result.path);
        return routeConfig?.expectedBreadcrumbs && !result.breadcrumbsPresent;
      });
  }

  public getAccessibilityIssues(): Array<{ path: string; issues: string[] }> {
    return Array.from(this.results.values())
      .filter(result => result.accessibilityIssues.length > 0)
      .map(result => ({
        path: result.path,
        issues: result.accessibilityIssues
      }));
  }

  public getPerformanceMetrics(): Array<{ path: string; loadTime: number }> {
    return Array.from(this.results.values())
      .filter(result => result.loadTime !== undefined)
      .map(result => ({
        path: result.path,
        loadTime: result.loadTime!
      }))
      .sort((a, b) => b.loadTime - a.loadTime);
  }

  public generateReport(): {
    summary: {
      totalRoutes: number;
      successfulRoutes: number;
      failedRoutes: number;
      warningRoutes: number;
      averageLoadTime: number;
    };
    details: NavigationTestResult[];
  } {
    const results = this.getResults();
    const loadTimes = results.filter(r => r.loadTime).map(r => r.loadTime!);
    
    return {
      summary: {
        totalRoutes: results.length,
        successfulRoutes: results.filter(r => r.status === 'success').length,
        failedRoutes: results.filter(r => r.status === 'error').length,
        warningRoutes: results.filter(r => r.status === 'warning').length,
        averageLoadTime: loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0
      },
      details: results
    };
  }
}