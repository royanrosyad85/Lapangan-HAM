import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppBreadcrumbs } from './app-breadcrumbs';

describe('AppBreadcrumbs', () => {
  it('marks only the final breadcrumb as the current page', () => {
    const { container } = render(
      <AppBreadcrumbs
        items={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'Fields', path: '/admin/fields' },
          { label: '#12' },
          { label: 'Edit' },
        ]}
      />,
    );

    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent('Edit');
  });
});
