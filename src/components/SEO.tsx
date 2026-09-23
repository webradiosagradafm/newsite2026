import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  url?: string
  jsonLd?: Record<string, unknown>
}

export default function SEO({
  title,
  description,
  url,
  jsonLd,
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

    // JSON-LD (Schema.org)
    // Usa um id fixo para poder localizar e atualizar/remover
    // a tag em re-renders, em vez de duplicar scripts.
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
    } else if (scriptTag) {
      // Se a página não passar jsonLd, remove qualquer
      // script deixado por uma página anterior (evita que
      // o JSON-LD errado "vaze" entre rotas no SPA).
      scriptTag.remove()
    }
  }, [title, description, url, jsonLd])

  return null
}
