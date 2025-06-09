import React, { useEffect, useState } from 'react';
import { Check, X, AlertTriangle, Clock, ExternalLink, Zap } from 'lucide-react';
import { NavigationTester } from '../../utils/navigation/navigationTester';
import { LinkChecker } from '../../utils/navigation/linkChecker';

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

interface LinkCheckResult {
  url: string;
  status: 'valid' | 'invalid' | 'external' | 'redirect' | 'slow';
  statusCode?: number;
  error?: string;
  responseTime?: number;
  redirectUrl?: string;
}

export function NavigationTest() {
  const [navigationResults, setNavigationResults] = useState<NavigationTestResult[]>([]);
  const [linkResults, setLinkResults] = useState<LinkCheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'navigation' | 'links' | 'performance'>('navigation');

  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        
        // Run navigation tests
        const navigationTester = NavigationTester.getInstance();
        const navResults = await navigationTester.testNavigation();
        setNavigationResults(navResults);

        // Run link checking tests
        const linkChecker = LinkChecker.getInstance();
        const commonLinks = await linkChecker.scanPageForLinks('');
        const linkResults = await linkChecker.checkMultipleLinks(commonLinks);
        setLinkResults(linkResults);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during testing');
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-4 text-white">Running comprehensive navigation tests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  const navigationTester = NavigationTester.getInstance();
  const linkChecker = LinkChecker.getInstance();
  
  const navReport = navigationTester.generateReport();
  const linkReport = linkChecker.generateReport();

  const failedRoutes = navigationTester.getFailedRoutes();
  const warningRoutes = navigationTester.getWarningRoutes();
  const missingBreadcrumbs = navigationTester.getMissingBreadcrumbs();
  const accessibilityIssues = navigationTester.getAccessibilityIssues();
  const performanceMetrics = navigationTester.getPerformanceMetrics();

  const invalidLinks = linkChecker.getInvalidLinks();
  const slowLinks = linkChecker.getSlowLinks();
  const externalLinks = linkChecker.getExternalLinks();

  const renderNavigationTab = () => (
    <div className="space-y-6">
      {/* Navigation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Total Routes</p>
          <p className="text-xl font-bold text-white">{navReport.summary.totalRoutes}</p>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          navReport.summary.failedRoutes === 0 
            ? 'bg-green-900/30 border-green-700/30' 
            : 'bg-red-900/30 border-red-700/30'
        }`}>
          <p className="text-sm text-gray-400">Failed Routes</p>
          <p className={`text-xl font-bold ${
            navReport.summary.failedRoutes === 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {navReport.summary.failedRoutes}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          navReport.summary.warningRoutes === 0 
            ? 'bg-green-900/30 border-green-700/30' 
            : 'bg-yellow-900/30 border-yellow-700/30'
        }`}>
          <p className="text-sm text-gray-400">Warnings</p>
          <p className={`text-xl font-bold ${
            navReport.summary.warningRoutes === 0 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {navReport.summary.warningRoutes}
          </p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Avg Load Time</p>
          <p className="text-xl font-bold text-white">
            {navReport.summary.averageLoadTime.toFixed(0)}ms
          </p>
        </div>
      </div>
      
      {/* Navigation Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700/50">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Path</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Load Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Breadcrumbs</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {navigationResults.map((result) => (
              <tr key={result.path} className="hover:bg-slate-700/30">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{result.path}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    result.status === 'success' ? 'bg-green-900/50 text-green-200' : 
                    result.status === 'warning' ? 'bg-yellow-900/50 text-yellow-200' :
                    'bg-red-900/50 text-red-200'
                  }`}>
                    {result.status === 'success' ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : result.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 mr-1" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    {result.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {result.loadTime ? `${result.loadTime.toFixed(0)}ms` : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {result.path === '/' ? (
                    <span className="text-gray-400">N/A</span>
                  ) : (
                    <span className={`inline-flex items-center ${
                      result.breadcrumbsPresent ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {result.breadcrumbsPresent ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-1" />
                      )}
                      {result.breadcrumbsPresent ? 'Present' : 'Missing'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {result.accessibilityIssues.length > 0 ? (
                    <span className="text-yellow-400">{result.accessibilityIssues.length} issues</span>
                  ) : (
                    <span className="text-green-400">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLinksTab = () => (
    <div className="space-y-6">
      {/* Links Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Total Links</p>
          <p className="text-xl font-bold text-white">{linkReport.summary.totalLinks}</p>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          linkReport.summary.invalidLinks === 0 
            ? 'bg-green-900/30 border-green-700/30' 
            : 'bg-red-900/30 border-red-700/30'
        }`}>
          <p className="text-sm text-gray-400">Invalid Links</p>
          <p className={`text-xl font-bold ${
            linkReport.summary.invalidLinks === 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {linkReport.summary.invalidLinks}
          </p>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">External Links</p>
          <p className="text-xl font-bold text-white">{linkReport.summary.externalLinks}</p>
        </div>

        <div className={`p-4 rounded-lg border ${
          linkReport.summary.slowLinks === 0 
            ? 'bg-green-900/30 border-green-700/30' 
            : 'bg-yellow-900/30 border-yellow-700/30'
        }`}>
          <p className="text-sm text-gray-400">Slow Links</p>
          <p className={`text-xl font-bold ${
            linkReport.summary.slowLinks === 0 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {linkReport.summary.slowLinks}
          </p>
        </div>
      </div>
      
      {/* Links Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700/50">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">URL</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Response Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {linkResults.map((result, index) => (
              <tr key={index} className="hover:bg-slate-700/30">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center">
                    {result.status === 'external' && <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />}
                    {result.status === 'slow' && <Clock className="h-4 w-4 mr-2 text-yellow-400" />}
                    <span className="truncate max-w-xs">{result.url}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    result.status === 'valid' ? 'bg-green-900/50 text-green-200' : 
                    result.status === 'external' ? 'bg-blue-900/50 text-blue-200' :
                    result.status === 'slow' ? 'bg-yellow-900/50 text-yellow-200' :
                    'bg-red-900/50 text-red-200'
                  }`}>
                    {result.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {result.responseTime ? `${result.responseTime.toFixed(0)}ms` : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {result.status === 'external' ? 'External' : 'Internal'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4">Slowest Routes</h3>
          <div className="space-y-2">
            {performanceMetrics.slice(0, 5).map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{metric.path}</span>
                <span className={`font-medium ${
                  metric.loadTime > 1000 ? 'text-red-400' : 
                  metric.loadTime > 500 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {metric.loadTime.toFixed(0)}ms
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4">Accessibility Issues</h3>
          <div className="space-y-2">
            {accessibilityIssues.slice(0, 5).map((issue, index) => (
              <div key={index} className="space-y-1">
                <span className="text-gray-300 font-medium">{issue.path}</span>
                <ul className="text-sm text-yellow-400 ml-4">
                  {issue.issues.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Navigation Test Results</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {[
            { id: 'navigation', label: 'Navigation', icon: Check },
            { id: 'links', label: 'Links', icon: ExternalLink },
            { id: 'performance', label: 'Performance', icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'navigation' && renderNavigationTab()}
        {activeTab === 'links' && renderLinksTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
      
      {/* Issue Summaries */}
      {failedRoutes.length > 0 && (
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">Failed Routes</h3>
          <ul className="space-y-2">
            {failedRoutes.map(route => (
              <li key={route.path} className="text-red-200">
                <span className="font-medium">{route.path}</span>: {route.error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {invalidLinks.length > 0 && (
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">Invalid Links</h3>
          <ul className="space-y-2">
            {invalidLinks.map((link, index) => (
              <li key={index} className="text-red-200">
                <span className="font-medium">{link.url}</span>: {link.error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}