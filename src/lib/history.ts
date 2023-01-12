import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "ap-northeast-1",
  endpoint: "https://dynamodb.ap-northeast-1.amazonaws.com",
});
const ddbClient = DynamoDBDocumentClient.from(client);

export const fetchHistoryByTitle = async (title: string) => {
  const queryParams: QueryCommandInput = {
    TableName: "RSSNotificationHistory",
    ConsistentRead: false,
    KeyConditionExpression: "Title = :value",
    ExpressionAttributeValues: { ":value": title },
  };

  try {
    const queryOutput = await ddbClient.send(new QueryCommand(queryParams));
    return queryOutput.Items || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

type PutHistoryInput = {
  title: string;
  link: string;
  description: string;
  publishedAt: string;
  notifiedAt: string;
};

export const putHistory = async (item: PutHistoryInput) => {
  try {
    await ddbClient.send(
      new PutCommand({
        TableName: "RSSNotificationHistory",
        Item: item,
      })
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
