import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const DEFAULT_IMAGE =
  "https://praisefmusa.com/discover-cover.jpg";

const DEFAULT_URL = "https://praisefmradio.com";

const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (key: string, content: string, isProperty = false) => {
      let meta = document.querySelector(
        isProperty
          ? `meta[property="${key}"]`
          : `meta[name="${key}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(isProperty ? "property" : "name", key);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    const finalImage = image || DEFAULT_IMAGE;
    const finalUrl = url || DEFAULT_URL;

    // ✅ Básico
    setMeta("description", description);

    // ✅ Open Graph (WhatsApp, Facebook)
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", finalImage, true);
    setMeta("og:url", finalUrl, true);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "Praise FM USA", true);

    // ✅ Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", finalImage);

  }, [title, description, image, url]);

  return null;
};

export default SEO;
