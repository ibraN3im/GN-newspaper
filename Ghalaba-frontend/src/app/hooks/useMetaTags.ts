import { useEffect } from 'react';
import { updateMetaTags, updateCanonicalUrl, addStructuredData } from '../utils/metaTags';

interface UseMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
  structuredData?: object;
}

export const useMetaTags = (meta: UseMetaTagsProps) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update all meta tags
    updateMetaTags(meta);

    // Update canonical URL if provided
    if (meta.url) {
      updateCanonicalUrl(meta.url);
    }

    // Add structured data if provided
    if (meta.structuredData) {
      addStructuredData(meta.structuredData);
    }

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // Note: We don't remove meta tags on unmount as it might cause flickering
      // when navigating between pages. The next page will update them anyway.
    };
  }, [meta]);
};
