import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
}

const DEFAULT_IMAGE =
  "https://praisefmusa.com/discover-cover.jpg";

const SEO: React.FC<SEOProps> = ({ title, description, image }) => {
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

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", image || DEFAULT_IMAGE, true);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "Praise FM USA", true);
    setMeta("twitter:card", "summary_large_image");
  }, [title, description, image]);

  return null;
};

export default SEO;
