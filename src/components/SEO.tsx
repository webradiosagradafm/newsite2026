
import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  url?: string
  image?: string
  jsonLd?: Record<string, unknown>
}

const SITE_URL = 'https://praisefmradio.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export default function SEO({
  title,
  description,
  url,
  image = DEFAULT_IMAGE,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    document.title = title

    const absoluteUrl = url
      ? new URL(url, SITE_URL).href
      : undefined

    const absoluteImage = new URL(image, SITE_URL).href

    const setMeta = (
      selector: string,
      attribute: 'name' | 'property',
      key: string,
      content: string
    ) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector)

      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, key)
        document.head.appendChild(tag)
      }

      tag.content = content
    }

    const setLink = (rel: string, href: string) => {
      let tag = document.head.querySelector<HTMLLinkElement>(
        `link[rel="${rel}"]`
      )

      if (!tag) {
        tag = document.createElement('link')
        tag.rel = rel
        document.head.appendChild(tag)
      }

      tag.href = href
    }

    setMeta(
      'meta[name="description"]',
      'name',
      'description',
      description
    )

    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      description
    )
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta(
      'meta[property="og:site_name"]',
      'property',
      'og:site_name',
      'Praise FM USA'
    )
    setMeta(
      'meta[property="og:image"]',
      'property',
      'og:image',
      absoluteImage
    )

    setMeta(
      'meta[name="twitter:card"]',
      'name',
      'twitter:card',
      'summary_large_image'
    )
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      description
    )
    setMeta(
      'meta[name="twitter:image"]',
      'name',
      'twitter:image',
      absoluteImage
    )

    if (absoluteUrl) {
      setLink('canonical', absoluteUrl)
      setMeta('meta[property="og:url"]', 'property', 'og:url', absoluteUrl)
    }

    const scriptId = 'seo-jsonld'
    let scriptTag = document.getElementById(
      scriptId
    ) as HTMLScriptElement | null

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.id = scriptId
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }

      scriptTag.textContent = JSON.stringify(jsonLd)
    } else {
      scriptTag?.remove()
    }
  }, [title, description, url, image, jsonLd])

  return null
}
