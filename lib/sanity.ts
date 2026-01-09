import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any): ImageUrlBuilder {
  return builder.image(source);
}

export interface CricketNews {
  _id: string;
  title: string;
  slug: { current: string };
  publishDate: string;
  category: 'IPL' | 'T20' | 'ODI' | 'Test';
  featuredImage?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  bannerImage?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  bannerLink?: string;
  body: string;
}

export async function getCricketNews(): Promise<CricketNews[]> {
  return await client.fetch(`
    *[_type == "cricketNews"] | order(publishDate desc) {
      _id,
      title,
      slug,
      publishDate,
      category,
      featuredImage,
      bannerImage,
      bannerLink,
      body
    }
  `);
}

export async function getCricketNewsBySlug(slug: string): Promise<CricketNews | null> {
  const results = await client.fetch(
    `*[_type == "cricketNews" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishDate,
      category,
      featuredImage,
      bannerImage,
      bannerLink,
      body
    }`,
    { slug }
  );
  return results || null;
}

