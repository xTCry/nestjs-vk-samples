import { Injectable } from '@nestjs/common';
import { CounterMetric, HistogramMetric, PromService } from '@digikare/nestjs-prom';
import { linearBuckets } from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly prefix = 'bot-full_';

  public readonly scheduleCounter: CounterMetric;

  public readonly vkRequestCounter: CounterMetric;
  public readonly vkRequestDurationHistogram: HistogramMetric;

  constructor(public readonly promService: PromService) {
    this.scheduleCounter = this.promService.getCounter({
      name: `${this.prefix}schedule_total`,
      help: 'Schedule request counter',
      labelNames: ['groupName'],
    });

    this.vkRequestCounter = this.promService.getCounter({
      name: `${this.prefix}vk_request_total`,
      labelNames: ['updateType', 'status'],
      help: 'VK requests - counter',
    });

    this.vkRequestDurationHistogram = this.promService.getHistogram({
      name: `${this.prefix}vk_request_duration`,
      help: 'VK requests - Duration in seconds',
      labelNames: ['updateType', 'status'],
      buckets: linearBuckets(0, 0.05, 10),
    });
  }
}
