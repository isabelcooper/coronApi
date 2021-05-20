import { routes, Routing } from 'http4js/core/Routing';
import { Method } from 'http4js/core/Methods';
import { HttpServer } from 'http4js/servers/NativeServer';
import { ContainerHandler } from './preview/ContainerHandler';
import { errorLoggingFilter } from '../../shared/src/http/ErrorLoggingFilter';
import { ReqOf, ResOf } from 'http4js';
import {
  Authenticator,
  BasicAuthAuthenticator,
  BasicAuthCredentials,
  ClientDashboardAuthenticator,
  ClientSessionTokenAuthenticator,
  TripteaseSystemAuthenticator,
} from '../../shared/src/auth/Authenticator';
import { InternalDashboardMetricsReader } from './dashboard/InternalDashboardMetrics';
import { InternalDashboardHandler } from './dashboard/InternalDashboardHandler';
import { CloudStorageWithFile } from '../../shared/src/storage/CloudStorage';
import { TemplateStore } from './TemplateStore';
import { CorsFilter } from '../../bee/src/HttpFilters';
import { DynamicAdvertContentHandler } from './ads/DynamicAdvertContentHandler';
import { GenericHandler } from './ads/GenericHandler';
import { HotelConfigHandler } from './hotel/HotelConfigHandler';
import { ApiaryClient } from '../../apiary/src/client/ApiaryClient';
import { ListHotelsHandler } from './onboarding/ListHotelsHandler';
import { EditHotelHandler } from './onboarding/EditHotelHandler';
import { OnboardNewHotelHandler } from './onboarding/OnboardNewHotelHandler';
import { LocalFileStore } from './FileStore';
import { AdvertContentPageHandler } from './onboarding/AdvertContentPageHandler';
import { AdConfigHandler } from './onboarding/AdConfigHandler';
import { AdvertRenderer } from './ads/AdvertRenderer';
import { ImageUploaderHandler } from './onboarding/ImageUploaderHandler';
import { FormImageUploader } from './onboarding/FormImageUploader';
import { BillingHandler } from './billing/BillingHandler';
import { XeroAccountsHandler } from './billing/XeroAccountsHandler';
import { AdSpendLineItemRetriever } from './billing/AdSpendLineItemRetriever';
import { BrandColorScraper } from './ads/AdvertColor';
import { CreateAdvertColorHandler } from './onboarding/CreateAdvertColorHandler';
import { DeleteAdvertColorHandler } from './onboarding/DeleteAdvertColorHandler';
import { SessionTokenValidator } from '../../shared/src/auth/SessionTokenValidator';
import { ClientDashboardHandler } from './dashboard/ClientDashboardHandler';
import { RetargetingDashboardStats } from './dashboard/ClientDashboard';
import { ClientHotelLookup } from './dashboard/AdSpendApi';
import { ScanBrandingHandler } from './onboarding/ScanBrandingHandler';
import { ApiaryAdvertCreator } from './ads/ApiaryAdvertCreator';
import { ClientEntitlementHandler } from './dashboard/ClientEntitlementHandler';
import { GoLiveValidator, RealGoLiveValidator } from './ads/GoLiveValidator';
import { GoogleImageTransformerAndUploader } from './upload/GoogleImageTransformerAndUploader';
import { StaticFileHandler } from '../../shared/src/http/StaticFileHandler';
import { HoneycombRoutes } from './HoneycombRoutes';
import { ExperimentsModule } from './experiments/ExperimentsModule';
import { Messaging } from '../../bee/src/messaging/Messaging';
import { defaultLogger } from '../../shared/src/log/Logger';
import { TemplateExperimentValidator } from './experiments/ExperimentValidator';
import { BillingTypeGroups } from './hotel/HotelConfig';
import { ApiaryCampaignManager } from './ads/ApiaryCampaignManager';
import { MetaInfoFinder } from './tools/hootle/PuppeteerMetaInfoFinder';
import { HootleModule } from './tools/hootle/HootleModule';
import { AdPreviewHandler } from './dashboard/AdPreviewHandler';
import { StaticBidExperimentReader } from '../../shared/src/experiment/Experiment';
import { FinanceApi } from '../../bee/src/finance/FinanceApi';
import { HotelConfigValidator } from './hotel/HotelConfigValidation';
import { FeatureDetector } from './ads/FeatureDetector';
import { ClearTodaysPriceHandler } from './onboarding/ClearTodaysPriceHandler';
import { RetargetingHotelConfigHandler } from './hotel/RetargetingHotelConfigHandler';
import { ClientValidator } from './ads/ClientValidator';
import { UpdateBillingTypeHandler } from './billing/UpdateBillingTypeHandler';
import { FinanceApiConversionBillingTypeUpdater } from './billing/ConversionBillingTypeUpdater';
import { StoreFactory } from './store/StoreFactory';
import { UpdateCreativeOptionsHandler } from './hotel/UpdateCreativeOptionsHandler';
import { CreativeOptionsHandler } from './hotel/CreativeOptionsHandler';
import { MetricsReporter } from '../../shared/src/metrics/MetricsReporter';
import { createResponseTimerWithPathFilter } from '../../shared/src/http/ResponseTimerFilter';
import { SearchDetailsHandler } from './ads/SearchDetailsHandler';
import { BulkOnboardingHandler } from './onboarding/BulkOnboardingHandler';
import { OnboardingCsvParser } from './onboarding/OnboardingCsvParser';
import {HootleRoutes} from "./src/HootleModule";
import {HootlePageHandler} from "./src/HootlePageHandler";

export class EnricherServer {
  private routing: Routing;

  constructor(
    private hootlePageHandler: HootlePageHandler,
  ) {
    const authenticator = new BasicAuthAuthenticator(credentials);
    this.routing = routes(
      Method.GET,
      '/',
      authenticator(this.hootlePageHandler),
    )
      .withPost('/', authenticator(this.hootlePageHandler))
      // .withGet(`/hootle/static/{fileName}`), new StaticFileHandler('honeycomb/src/tools/static'));
      .withGet('/health', async () => ResOf(200))
      // .withOptions('/.*', async () => ResOf(200)) // For CORS, see CORS filter below
      // .withFilter(createResponseTimerWithPathFilter(metricsReporter))
      // .withFilter(errorLoggingFilter(metricsReporter))
      // .withFilter(new CorsFilter().filter)
      .asServer(HttpServer(process.env.PORT ? Number(process.env.PORT) : 7001));
  }

  async start(): Promise<void> {
    return this.routing.start();
  }

  async stop(): Promise<void> {
    return this.routing.stop();
  }
}
