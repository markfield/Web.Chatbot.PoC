import { SearchResponse } from "../types/types";

export const getWebsiteSearchResults = async (query: string) => {
  const response = await fetch(
    `https://umasslowell.azure-api.net/search/website/v3/results?q=${query}`
  );

  const responseJson = (await response.json()) as SearchResponse;

  if (responseJson.results.length >= 2) {
    return responseJson.results.slice(0, 2);
  } else if (responseJson.results.length > 0) {
    return responseJson.results;
  } else {
    return [];
  }
};
