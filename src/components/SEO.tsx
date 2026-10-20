import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  url?: string
  image?: string
  jsonLd?: Record<string, unknown>
}

const SITE_URL = 'https://praisefmradio.vercel.app'

export default function SEO({
  title,
  description,
  url,
  image,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    document.title = title

    const absoluteUrl = url
      ? new URL(url, SITE_URL).href
      : undefined

    const imageUrl = image
      ? new URL(image, SITE_URL).href
      : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`

    function setMeta(
      attribute: 'name' | 'property',
      key: string,
      content: string,
    ) {
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      )

      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, key)
        document.head.appendChild(tag)
      }

      tag.content = content
    }

    function setLink(rel: string, href: string) {
      let tag = document.head.querySelector<HTMLLinkElement>(
        `link[rel="${rel}"]`,
      )

      if (!tag) {
        tag = document.createElement('link')
        tag.rel = rel
        document.head.appendChild(tag)
      }

      tag.href = href
    }

    // SEO básico
    setMeta('name', 'description', description)

    // Open Graph
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'Praise FM USA')
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')

    if (absoluteUrl) {
      setLink('canonical', absoluteUrl)
      setMeta('property', 'og:url', absoluteUrl)
    }

    // Twitter / X
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)

    // Dados estruturados JSON-LD
    const scriptId = 'seo-jsonld'
    let scriptTag = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.id = scriptId
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }

      scriptTag.textContent = JSON.stringify(jsonLd)
    } else if (scriptTag) {
      scriptTag.remove()
    }
  }, [title, description, url, image, jsonLd])

  return null
}