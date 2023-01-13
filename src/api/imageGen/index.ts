const LEXICA_API = "https://lexica.art/api/v1/search";

const buildLexicaSearchUrl = (query: string) => {
  return `${LEXICA_API}?q=${encodeURIComponent(query)}`;
};

export interface ImageFE {
  id: string;
  src: string;
  srcSmall: string;
  width: number;
  height: number;
}

export const fetchImages = async (query: string): Promise<ImageFE[]> => {
  const url = buildLexicaSearchUrl(query);
  const response = await fetch(url);
  const data = await response.json();
  console.log("fetched images", data);

  if (data && "images" in data) {
    return (
      data.images
        // Filter NSFW images
        .filter((image: any) => !image.nsfw)
        .map((image: any) => ({
          id: image.id,
          src: image.src,
          srcSmall: image.srcSmall,
          width: image.width ?? 200,
          height: image.height ?? 200,
        }))
    );
  } else {
    console.error("No images found", data);
    return [];
  }
};
