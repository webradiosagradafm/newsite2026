import { Helmet } from 'react-helmet'

interface SEOProps {
  title: string
  description: string
  url?: string
}

export default function SEO({
  title,
  description,
  url
}: SEOProps) {
  return (
    <Helmet>

      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content="website"
      />

      {url && (
        <meta
          property="og:url"
          content={url}
        />
      )}

      {url && (
        <link
          rel="canonical"
          href={url}
        />
      )}

    </Helmet>
  )
}