import Parser from "rss-parser";
import dayjs from "dayjs";
import { isNewItem, isValidItem } from "./lib/validate";
import { buildMessageBody, notify } from "./lib/notify";
import { translate } from "./lib/translate";
import { feeds } from "./feeds";
import { getEnv } from "./env";

const parser = new Parser({
  customFields: {
    item: ["description"],
  },
});

export const handler = async () => {
  const {
    WEBHOOK_URL_BLOGS,
    WEBHOOK_URL_ANNOUNCEMENTS,
    LAST_RETREIVED_THRESHOLD_MINUTE,
    DRY_RUN,
  } = getEnv();
  const nowDate = dayjs();

  for (const feed of feeds) {
    console.info(`Now processing ${feed.title}...`);

    const posts = await parser.parseURL(feed.url);
    const items = await Promise.all(
      posts.items
        .filter(
          (item) =>
            isValidItem(item) &&
            isNewItem({
              pubDate: dayjs(item.pubDate),
              nowDate,
              lastRetrievedThresholdMinute: LAST_RETREIVED_THRESHOLD_MINUTE,
            })
        )
        .map(async (item) => ({
          feed: feed.title!,
          title: (await translate(item.title!))!,
          link: item.link!,
          description: (await translate(item.description!))!,
        }))
    );

    if (items.length > 0) {
      const body = buildMessageBody({
        source: feed.title,
        items,
      });

      if (!DRY_RUN) {
        await notify({
          url:
            feed.type === "blogs"
              ? WEBHOOK_URL_BLOGS
              : WEBHOOK_URL_ANNOUNCEMENTS,
          body,
        });
      } else {
        console.info("DRY_RUN is true. Skip notification.");
        console.info({ ...body });
      }
    }
  }

  return 0;
};

handler();
