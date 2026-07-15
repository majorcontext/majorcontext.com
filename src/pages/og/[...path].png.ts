import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ImageResponse } from '@vercel/og';

interface Props {
  title: string;
  description: string;
  brandColor: string;
}

// Tailwind `-700` hex values for each product's accent color (see
// src/lib/products.ts `color`), used for the OG image brand square.
// Falls back to Moat's sky-700 so the site homepage and any unrecognized
// path render identically to before this map existed.
const BRAND_COLORS: Record<string, string> = {
  moat: '#0369a1', // sky-700
  keep: '#b45309', // amber-700
  gatekeeper: '#047857', // emerald-700
};
const DEFAULT_BRAND_COLOR = BRAND_COLORS.moat;

export async function getStaticPaths() {
  const moatDocs = await getCollection('moat');
  const keepDocs = await getCollection('keep');
  const gatekeeperDocs = await getCollection('gatekeeper');

  const paths = [
    // Site homepage
    {
      params: { path: 'home' },
      props: {
        title: 'Major Context',
        description: 'Safe infrastructure for AI agents',
        brandColor: DEFAULT_BRAND_COLOR,
      },
    },
    // Moat homepage
    {
      params: { path: 'moat' },
      props: {
        title: 'Moat',
        description: 'Let agents break things safely',
        brandColor: BRAND_COLORS.moat,
      },
    },
    // Keep homepage
    {
      params: { path: 'keep' },
      props: {
        title: 'Keep',
        description: 'Policy engine for AI agent tool calls',
        brandColor: BRAND_COLORS.keep,
      },
    },
    // Gatekeeper homepage
    {
      params: { path: 'gatekeeper' },
      props: {
        title: 'Gatekeeper',
        description: 'Credential-injecting TLS-intercepting proxy',
        brandColor: BRAND_COLORS.gatekeeper,
      },
    },
    // All Moat documentation pages
    ...moatDocs.map((doc) => {
      const parts = doc.id.split('/');
      const category = parts[0];
      const fileName = parts[1];
      const slug = fileName.replace(/^\d+-/, '').replace(/\.md$/, '');
      const path = `moat/${category}/${slug}`;

      return {
        params: { path },
        props: {
          title: doc.data.title,
          description: doc.data.description || 'Moat Documentation',
          brandColor: BRAND_COLORS.moat,
        },
      };
    }),
    // All Keep documentation pages
    ...keepDocs.map((doc) => {
      const parts = doc.id.split('/');
      const category = parts[0];
      const fileName = parts[1];
      const slug = fileName.replace(/^\d+-/, '').replace(/\.md$/, '');
      const path = `keep/${category}/${slug}`;

      return {
        params: { path },
        props: {
          title: doc.data.title,
          description: doc.data.description || 'Keep Documentation',
          brandColor: BRAND_COLORS.keep,
        },
      };
    }),
    // All Gatekeeper documentation pages
    ...gatekeeperDocs.map((doc) => {
      const parts = doc.id.split('/');
      const category = parts[0];
      const fileName = parts[1];
      const slug = fileName.replace(/^\d+-/, '').replace(/\.md$/, '');
      const path = `gatekeeper/${category}/${slug}`;

      return {
        params: { path },
        props: {
          title: doc.data.title,
          description: doc.data.description || 'Gatekeeper Documentation',
          brandColor: BRAND_COLORS.gatekeeper,
        },
      };
    }),
  ];

  return paths;
}

export const GET: APIRoute = async ({ props, params }) => {
  const { title, description, brandColor } = props as Props;
  const pathStr = (params as { path: string }).path || 'home';
  const footerUrl = `majorcontext.com/${pathStr.split('/')[0]}`;

  // Create the OG image using Vercel OG / Satori
  const html = {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundImage: 'radial-gradient(circle at bottom right, #e0f2fe 0%, #f5f5f4 50%)',
        padding: 60,
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 96,
                    fontWeight: 700,
                    color: '#292524',
                    lineHeight: 1.2,
                    maxWidth: 1000,
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 50,
                    color: '#44403c',
                    lineHeight: 1.4,
                    maxWidth: 900,
                  },
                  children: description,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 28,
              fontWeight: 600,
              color: '#57534e',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 40,
                    height: 40,
                    backgroundColor: brandColor || DEFAULT_BRAND_COLOR,
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'span',
                props: {
                  children: footerUrl,
                },
              },
            ],
          },
        },
      ],
    },
  };

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
  });
};
