import {
  //  Duration,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

export class RssFeedTranslaterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const rssFeedTranslaterLambda = new nodejs.NodejsFunction(
      this,
      "rssFeedTranslater",
      {
        entry: "src/index.ts",
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_18_X,
        environment: {
          SLACK_INCOMING_WEBHOOK_URL_BLOGS:
            ssm.StringParameter.valueForStringParameter(
              this,
              `/RSS_FEED_TRANSLATER/SLACK_INCOMING_WEBHOOK-URL-BLOGS`
            ),
          SLACK_INCOMING_WEBHOOK_URL_ANNOUNCEMENTS:
            ssm.StringParameter.valueForStringParameter(
              this,
              `/RSS_FEED_TRANSLATER/SLACK_INCOMING-WEBHOOK-URL-ANNOUNCEMENTS`
            ),
          LAST_RETREIVED_THRESHOLD_MINUTE:
            ssm.StringParameter.valueForStringParameter(
              this,
              `/RSS_FEED_TRANSLATER/LAST_RETREIVED_THRESHOLD_MINUTE`
            ),
        },
        functionName: "RssFeedTranslater",
        description: "AWSのRSS情報を読み取り日本語化してSlackに通知する",
      }
    );
  }
}
