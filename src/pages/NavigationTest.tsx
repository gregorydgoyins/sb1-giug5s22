import React from 'react';
import { NavigationTest } from '../components/navigation/NavigationTest';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export function NavigationTestPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Navigation Test' }]} />
      <h1 className="text-3xl font-bold text-white mb-6">Navigation System Test</h1>
      <NavigationTest />
    </div>
  );
}