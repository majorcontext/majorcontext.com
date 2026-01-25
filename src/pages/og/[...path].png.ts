import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ImageResponse } from '@vercel/og';

interface Props {
  title: string;
  description: string;
}

export async function getStaticPaths() {
  const moatDocs = await getCollection('moat');

  const paths = [
    // Homepage
    {
      params: { path: 'moat' },
      props: {
        title: 'Moat',
        description: 'Let agents break things safely',
      },
    },
    // All documentation pages
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
        },
      };
    }),
  ];

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as Props;

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
        backgroundImage: 'linear-gradient(to bottom, #f5f5f4, #e7e5e4)',
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
                    fontSize: 72,
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
                    fontSize: 36,
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
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 40,
                    height: 40,
                    backgroundColor: '#0369a1',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'span',
                props: {
                  children: 'MAJOR CONTEXT',
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
