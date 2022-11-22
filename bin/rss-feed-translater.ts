#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RssFeedTranslaterStack } from '../lib/rss-feed-translater-stack';

const app = new cdk.App();
new RssFeedTranslaterStack(app, 'RssFeedTranslaterStack');
