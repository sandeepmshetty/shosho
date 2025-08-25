export interface TwitterTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface TwitterUserResponse {
  data: {
    id: string;
    username: string;
    name: string;
  };
}

export interface TwitterAnalyticsResponse {
  data: {
    organic_metrics: {
      impression_count: number;
      like_count: number;
      reply_count: number;
      retweet_count: number;
    }[];
  };
}
