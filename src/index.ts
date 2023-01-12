import Parser from "rss-parser";
import dayjs from "dayjs";
import { isNewItem, isValidItem } from "./lib/validate";
import { buildMessageBody, notify } from "./lib/notify";
import { translate } from "./lib/translate";
import { feeds } from "./feeds";
import { getEnv } from "./env";
import { putHistory } from "./lib/history";
import { CfnSolution } from "aws-cdk-lib/aws-personalize";

const parser = new Parser({
  customFields: {
    item: ["description"],
  },
});

export const handler = async () => {
  const nowDate = dayjs();

  const {
    SLACK_INCOMING_WEBHOOK_URL_BLOGS,
    SLACK_INCOMING_WEBHOOK_URL_ANNOUNCEMENTS,
    DRY_RUN,
  } = getEnv();

  await Promise.all(
    feeds.map(async (feed) => {
      console.info(`Now processing ${feed.title}...`);

      const posts = await parser.parseURL(feed.url);
      const bitsForFilter = await Promise.all(
        posts.items.map(
          async (item) =>
            isValidItem(item) &&
            (await isNewItem({
              title: item.title!,
              nowDate,
              pubDate: dayjs(item.pubDate),
            }))
        )
      );
      const filteredPosts = posts.items.filter(() => bitsForFilter.shift());
      const newPosts = await Promise.all(
        filteredPosts.map(async (item) => ({
          feed: feed.title!,
          title: (await translate(item.title!))!,
          rawTitle: item.title!,
          link: item.link!,
          description: (await translate(item.description!))!,
          rawDescription: item.description!,
          pubDate: item.pubDate!,
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
          console.info(JSON.stringify(body));
        }

        for await (const post of newPosts) {
          const item = {
            Title: post.rawTitle!,
            Type: feed.type,
            Link: post.link,
            Description: post.rawDescription,
            PublishedAt: dayjs(post.pubDate).toISOString(),
            NotifiedAt: dayjs().toISOString(),
          };
          putHistory(item);
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
