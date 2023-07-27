import { Translate } from "@aws-sdk/client-translate";
import * as dayjs from "dayjs";
import * as Parser from "rss-parser";
import { fetchHistoryByTitle } from "./history";

export const isNewItem = async (options: {
  title: string;
  pubDate: dayjs.Dayjs;
  nowDate: dayjs.Dayjs;
}) => {
  if (options.pubDate.isBefore(options.nowDate.subtract(1, "month"))) {
    return false;
  }

  const historyItems = await fetchHistoryByTitle(
    // AWS API Changesなど、重複するtitleに対応して日付もキーに含める
    options.title + options.pubDate.toISOString()
  );
  return historyItems.length == 0;
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
