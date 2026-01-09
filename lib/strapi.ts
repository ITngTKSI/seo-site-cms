const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface CricketNews {
  id: number;
  title: string;
  slug: string;
  publishDate: string;
  category: 'IPL' | 'T20' | 'ODI' | 'Test';
  featuredImage?: {
    url: string;
    alternativeText?: string;
  };
  bannerImage?: {
    url: string;
    alternativeText?: string;
  };
  bannerLink?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface StrapiResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
}

interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  } | null;
}

interface CricketNewsAttributes {
  title: string;
  slug: string;
  publishDate: string;
  category: 'IPL' | 'T20' | 'ODI' | 'Test';
  featuredImage?: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    } | null;
  };
  bannerImage?: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    } | null;
  };
  bannerLink?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

function transformStrapiData(item: { id: number; attributes: CricketNewsAttributes }): CricketNews {
  return {
    id: item.id,
    title: item.attributes.title,
    slug: item.attributes.slug,
    publishDate: item.attributes.publishDate,
    category: item.attributes.category,
    featuredImage: item.attributes.featuredImage?.data ? {
      url: item.attributes.featuredImage.data.attributes.url,
      alternativeText: item.attributes.featuredImage.data.attributes.alternativeText,
    } : undefined,
    bannerImage: item.attributes.bannerImage?.data ? {
      url: item.attributes.bannerImage.data.attributes.url,
      alternativeText: item.attributes.bannerImage.data.attributes.alternativeText,
    } : undefined,
    bannerLink: item.attributes.bannerLink,
    body: item.attributes.body,
    createdAt: item.attributes.createdAt,
    updatedAt: item.attributes.updatedAt,
  };
}

export async function getCricketNews(): Promise<CricketNews[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/cricket-news?populate=*&sort=publishDate:desc`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data: StrapiResponse<CricketNewsAttributes> = await response.json();
    return data.data.map(transformStrapiData);
  } catch (error) {
    console.error('Error fetching cricket news:', error);
    return [];
  }
}

export async function getCricketNewsBySlug(slug: string): Promise<CricketNews | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/cricket-news?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data: StrapiSingleResponse<CricketNewsAttributes> = await response.json();
    if (!data.data) return null;
    return transformStrapiData(data.data);
  } catch (error) {
    console.error('Error fetching cricket news by slug:', error);
    return null;
  }
}

export function getStrapiImageUrl(image: { url: string } | undefined): string {
  if (!image) return '';
  const url = image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`;
  return url;
}

