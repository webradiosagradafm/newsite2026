import { useEffect } from 'react'

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
  useEffect(() => {
    document.title = title

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    )

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }

    descriptionTag.setAttribute('content', description)

    let canonicalTag = document.querySelector(
      'link[rel="canonical"]'
    )

    if (url) {
      if (!canonicalTag) {
        canonicalTag = document.createElement('link')
        canonicalTag.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalTag)
      }

      canonicalTag.setAttribute('href', url)
    }

    const setMeta = (
      property: string,
      content: string
    ) => {
      let tag = document.querySelector(
        `meta[property="${property}"]`
      )

      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }

      tag.setAttribute('content', content)
    }

    setMeta('og:title', title)
    setMeta('og:description', description)
    setMeta('og:type', 'website')

    if (url) {
      setMeta('og:url', url)
    }
  }, [title, description, url])

  return null
}