import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export interface Pop50Request {
  "current-stock-price": number;
  "current-time-at": Date;
  "histogram-ideal-range-count": number;
  "initial-cost": number;
  "initial-cost-effect": string;
  "interest-rate": number;
  "target-fraction-of-cost": number;
  volatility: number;
  legs: PopRequestLeg[];
  source: string;
}

export interface PopRequestLeg {
  action: "sell_to_open" | "buy_to_open";
  "asset-type": "Equity Option";
  "call-or-put": "P" | "C";
  "days-to-expiration": number;
  quantity: number;
  "strike-price": number;
  "contract-implied-volatility": number;
  "expiration-implied-volatility": number;
}
export interface Pop50Response {
  "num-of-paths": number;
  "steps-per-day": number;
  "winner-count": number;
  "total-milliseconds-to-compute": number;
  "theoretical-cost": string;
  "theoretical-cost-effect": "Debit" | "Credit";
  "target-cost": string;
  "target-cost-effect": string;
  "conditional-value-at-risk-cost": string;
  "conditional-value-at-risk-cost-effect": string;
  "target-fraction-of-cost": string;
  "probability-of-making-target": string;
  "theoretical-price-movement-for-one-day": string;
  "theoretical-spot-price": string;
  "adjusted-implied-volatility-for-path": string;
  "time-adjusted-implied-volatility-for-path": string;
  "path-results": PathResult[];
  "price-histogram": PopPriceHistogram[];
  "winning-steps-histogram": PopWinningStepsHistogram[];
}

export interface PathResult {
  cost: string;
  "cost-effect": "Debit" | "Credit";
  steps: number;
  "stock-price": string;
}

export interface PopPriceHistogram {
  low: string;
  high: string;
  count: number;
  "range-index": number;
}

export interface PopWinningStepsHistogram {
  low: string;
  high: string;
  count: number;
  "range-index": number;
}

export default class PopService {
  constructor(private httpClient: TastytradeHttpClient) {}

  /**
   * Get statistical estimation of 50% probability of profit
   * @param requestData
   * @returns {Pop50Response}
   */
  async get50Pop(requestData: Pop50Request): Promise<Pop50Response> {
    const popResponse = await this.httpClient.postData(
      "/fifty-percent-pop",
      requestData,
      {}
    );
    return extractResponseData(popResponse) as Pop50Response;
  }
}
