"use client";

import { useEffect, useState } from "react";

/**
 * Fetch site images from the API and provide a helper to resolve
 * image URLs with sensible fallbacks.
 */
export function useSiteImages(fallbacks = {}) {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/site-images");
        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data)) return;

        const map = data.reduce((acc, image) => {
          if (image?.key) {
            acc[image.key] = image.url || image.image;
          }
          return acc;
        }, {});

        if (active) {
          setImages(map);
        }
      } catch (error) {
        console.error("Failed to fetch site images:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const getImage = (key, fallback) => images[key] || fallbacks[key] || fallback || "";

  return { images, getImage, loading };
}

