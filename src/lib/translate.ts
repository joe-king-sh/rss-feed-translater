import { Translate } from "@aws-sdk/client-translate";
import { getEnv } from "../env";
const translateClient = new Translate({
  region: "ap-northeast-1",
});

export const translate = async (text: string) => {
  const { DRY_RUN } = getEnv();

  if (DRY_RUN) {
    console.info("DRY_RUN is true. Skip translation.");
    return text;
  }

  const result = await translateClient.translateText({
    Text: text,
    SourceLanguageCode: "en",
    TargetLanguageCode: "ja",
  });
  return result.TranslatedText;
};
