import { DynamicModule, Global, MiddlewareConsumer, Module, ModuleMetadata, NestModule } from '@nestjs/common';
import { InboundMiddleware, PromModule, PromModuleOptions } from '@digikare/nestjs-prom';
import { DEFAULT_PROM_OPTIONS } from '@digikare/nestjs-prom/dist/prom.constants';

import { MetricsService } from './metrics.service';
import { ConfigService } from '@nestjs/config';

const METRIC_PATH = '/api/metrics';

export interface MetricsAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  appName?: string;
  prometheusEnabled?: boolean;
  useFactory?: (...args: any[]) => Promise<MetricsAsyncOptions>;
  inject?: any[];
}

@Global()
@Module({})
export class MetricsModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  static forRootAsync(options: MetricsAsyncOptions): DynamicModule {
    const moduleForRoot: DynamicModule = {
      module: MetricsModule,
      imports: [],
      providers: [MetricsService],
      exports: [MetricsService],
    };

    if (options.prometheusEnabled) {
      const promOptions: PromModuleOptions = {
        metricPath: METRIC_PATH,
        withDefaultsMetrics: true,
        withDefaultController: true,
        defaultLabels: {
          app: options.appName,
        },
      };

      moduleForRoot.imports.push(PromModule.forRoot(promOptions));

      moduleForRoot.providers.push({
        provide: DEFAULT_PROM_OPTIONS,
        useValue: promOptions,
      });
    }

    return moduleForRoot;
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.configService.get<boolean>('PROMETHEUS_ENABLED')) {
      // We register the Middleware ourselves to avoid tracking
      // latency for static files served for the frontend.
      consumer.apply(InboundMiddleware).exclude(METRIC_PATH).forRoutes('/api');
    }
  }
}
