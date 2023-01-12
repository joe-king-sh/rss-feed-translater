import { Translate } from "@aws-sdk/client-translate";
import * as dayjs from "dayjs";
import * as Parser from "rss-parser";
import { fetchHistoryByTitle } from "./history";

export const isNewItem = async (options: { title: string }) => {
  const historyItems = await fetchHistoryByTitle(options.title);
  return historyItems.length === 0;
};

export const isValidItem = (
  feedItem: {
    description: any;
  } & Parser.Item
) => {
  if (
    !feedItem.title ||
    !feedItem.link ||
    !feedItem.description ||
    !feedItem.pubDate
  ) {
    console.warn("Invalid feed item:", feedItem);
  }
  return true;
};
