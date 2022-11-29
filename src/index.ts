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
    SLACK_INCOMING_WEBHOOK_URL_BLOGS,
    SLACK_INCOMING_WEBHOOK_URL_ANNOUNCEMENTS,
    LAST_RETREIVED_THRESHOLD_MINUTE,
    DRY_RUN,
  } = getEnv();
  const nowDate = dayjs();

  await Promise.all(
    feeds.map(async (feed) => {
      console.info(`Now processing ${feed.title}...`);

      const posts = await parser.parseURL(feed.url);
      const newPosts = await Promise.all(
        posts.items
          .filter((item) => {
            if (feed.type === "announcements") {
              console.log("this post is from announcements");
              console.log({ item });
            }
            return (
              isValidItem(item) &&
              isNewItem({
                pubDate: dayjs(item.pubDate),
                nowDate,
                lastRetrievedThresholdMinute:
                  feed.type == "announcements"
                    ? // what's newのRSSのpubDateに過去日が挿入されてきて拾えない問題があるので閾値を広くする
                      240
                    : LAST_RETREIVED_THRESHOLD_MINUTE,
              })
            );
          })
          .map(async (item) => ({
            feed: feed.title!,
            title: (await translate(item.title!))!,
            link: item.link!,
            description: (await translate(item.description!))!,
          }))
      );

      if (newPosts.length > 0) {
        console.info(`Found ${newPosts.length} new items!`);

        const body = buildMessageBody({
          source: feed.title,
          posts: newPosts,
        });

        if (!DRY_RUN) {
          await notify({
            url:
              feed.type === "blogs"
                ? SLACK_INCOMING_WEBHOOK_URL_BLOGS
                : SLACK_INCOMING_WEBHOOK_URL_ANNOUNCEMENTS,
            body,
          });
        } else {
          console.info("DRY_RUN is true. Skip notification.");
          console.info({ ...body });
        }
      }
    })
  );

  return 0;
};

// For local test.
if (require.main === module) {
  handler();
}
