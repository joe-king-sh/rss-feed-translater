# RSS Feed Translater

## これは何？

AWSから英語で提供されているRSSをAmazon Translateで日本語化してSlackへ通知します。  

対象のRSSは[AWS Blogs](https://aws.amazon.com/blogs/)と[What's New with AWS](https://aws.amazon.com/about-aws/whats-new/2022)です。  
詳細は[src/feed.ts](./src/lib/feed.ts)をご確認ください

### アーキテクチャ
![](./docs/architecture.drawio.png)

### 実行イメージ
| 翻訳前 | 翻訳後 |
|---|---|
| ![](./docs/aws-blogs-en.png) |  ![](./docs/aws-blogs-ja.png)  |

## デプロイ
### 1.パラメーターストアの設定
デプロイ前に以下をパラメーターストアに登録する必要があります
  - `/RSS_FEED_TRANSLATER/SLACK_INCOMING_WEBHOOK-URL-BLOGS`
    - AWS Blogsの通知先となるSlacのWebhookURL
  - `/RSS_FEED_TRANSLATER/SLACK_INCOMING-WEBHOOK-URL-ANNOUNCEMENTS`
    - What's New の通知先となるSlacのWebhookURL
  - `/RSS_FEED_TRANSLATER/LAST_RETREIVED_THRESHOLD_MINUTE`
    - Lambda実行時刻と比較し、ここで指定した分数過去分の記事を収集する
    - ※このパラメーターはしばらく様子見て後から消す

### 2. デプロイ
```bash
$ npx cdk deploy
```