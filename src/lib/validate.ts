import { Translate } from "@aws-sdk/client-translate";
import * as dayjs from "dayjs";
import * as Parser from "rss-parser";

export const isNewItem = (options: {
  pubDate: dayjs.Dayjs;
  nowDate: dayjs.Dayjs;
  lastRetrievedThresholdMinute: number;
}) => {
  // 以下の閾値の範囲で更新された記事を収集する
  return options.pubDate.isAfter(
    options.nowDate.subtract(options.lastRetrievedThresholdMinute, "minute")
  );
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
