export const getEnv = () => {
  const {
    WEBHOOK_URL_BLOGS,
    WEBHOOK_URL_ANNOUNCEMENTS,
    LAST_RETREIVED_THRESHOLD_MINUTE,
    DRY_RUN,
  } = process.env;
  if (!WEBHOOK_URL_BLOGS) throw new Error("WEBHOOK_URL_BLOGS is not set");
  if (!WEBHOOK_URL_ANNOUNCEMENTS)
    throw new Error("WEBHOOK_URL_ANNOUNCEMENTS is not set");

  return {
    WEBHOOK_URL_BLOGS,
    WEBHOOK_URL_ANNOUNCEMENTS,
    LAST_RETREIVED_THRESHOLD_MINUTE:
      LAST_RETREIVED_THRESHOLD_MINUTE !== undefined
        ? Number(LAST_RETREIVED_THRESHOLD_MINUTE)
        : 60,
    DRY_RUN: DRY_RUN === "true" ? true : false,
  };
};
