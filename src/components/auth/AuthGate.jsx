import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthProvider.jsx';

/**
 * Resolve a path under the project's configured base URL so links keep
 * working when the site is hosted under `/brandzo-warehouse-system/` on
 * GitHub Pages.
 */
function withBase(path) {
  const base = import.meta.env.BASE_URL || '/';
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}

function GateContents({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user === null && typeof window !== 'undefined') {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.replace(`${withBase('/login')}?next=${next}`);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" dir="rtl">
        <div className="text-gray-500 font-bold">جاري التحقق من تسجيل الدخول…</div>
      </div>
    );
  }

  if (user === null) {
    // The redirect effect above will run; render nothing in the meantime so
    // the protected content never flashes.
    return null;
  }

  return children;
}

/**
 * Wrap any subtree that should only be visible to signed-in users.
 *
 * Usage (in an Astro page):
 *
 *   <AuthGate client:load>
 *     <ProtectedComponent />
 *   </AuthGate>
 */
export default function AuthGate({ children }) {
  return (
    <AuthProvider>
      <GateContents>{children}</GateContents>
    </AuthProvider>
  );
}
