import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  searchQuery: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  setGlobalSearch: (q: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const REPO_BASE = '/HUBV3';

/**
 * Strips the GitHub Pages repository prefix (`/HUBV3`) from a browser pathname
 * so the application always works with clean logical routes (`/`, `/shop`, `/product/vr001`, etc.).
 */
export function stripBasePath(pathname: string): string {
  if (!pathname) return '/';
  let cleaned = pathname;

  // Strip /HUBV3 prefix (case-insensitive for safety)
  if (cleaned.toLowerCase().startsWith(REPO_BASE.toLowerCase())) {
    cleaned = cleaned.slice(REPO_BASE.length);
  }

  // Also handle index.html if accessed directly
  if (cleaned.endsWith('/index.html')) {
    cleaned = cleaned.slice(0, -'/index.html'.length);
  }

  if (!cleaned || cleaned === '') {
    return '/';
  }

  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

/**
 * Prepends `/HUBV3` when running on GitHub Pages or under `/HUBV3/`
 * so browser URLs and `<a href>` attributes point to `/HUBV3/...`.
 */
export function withBasePath(logicalPath: string): string {
  const cleanLogical = logicalPath.startsWith('/') ? logicalPath : `/${logicalPath}`;
  const isUnderRepoPath =
    typeof window !== 'undefined' &&
    window.location.pathname.toLowerCase().startsWith(REPO_BASE.toLowerCase());

  if (import.meta.env.PROD || isUnderRepoPath) {
    return cleanLogical === '/' ? `${REPO_BASE}/` : `${REPO_BASE}${cleanLogical}`;
  }

  return cleanLogical;
}

function getInitialLogicalPath(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Check if redirected from a query-based 404.html fallback (?p=/shop)
  const params = new URLSearchParams(window.location.search);
  const redirectedRoute = params.get('p');
  if (redirectedRoute) {
    const logical = stripBasePath(redirectedRoute);
    const fullUrl = withBasePath(logical);
    window.history.replaceState({}, '', fullUrl);
    return logical;
  }

  // 2. Check sessionStorage fallback if used
  try {
    const storedRedirect = sessionStorage.getItem('volterra_spa_redirect');
    if (storedRedirect) {
      sessionStorage.removeItem('volterra_spa_redirect');
      const logical = stripBasePath(storedRedirect);
      const fullUrl = withBasePath(logical);
      window.history.replaceState({}, '', fullUrl);
      return logical;
    }
  } catch {}

  // 3. Standard pathname resolution (works directly with dist/404.html copy of dist/index.html)
  return stripBasePath(window.location.pathname);
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(getInitialLogicalPath);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      setPath(stripBasePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const logicalRoute = stripBasePath(to.startsWith('/') ? to : `/${to}`);
    const browserUrl = withBasePath(logicalRoute);

    if (options?.replace) {
      window.history.replaceState({}, '', browserUrl);
    } else {
      window.history.pushState({}, '', browserUrl);
    }
    setPath(logicalRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setGlobalSearch = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  return (
    <RouterContext.Provider value={{ path, searchQuery, navigate, setGlobalSearch }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, children, onClick, className, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  const resolvedHref = withBasePath(stripBasePath(to));

  return (
    <a href={resolvedHref} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};
