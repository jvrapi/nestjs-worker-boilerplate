export abstract class AppConfigService {
  abstract readonly appName: string;
  abstract readonly isProduction: boolean;
  abstract readonly isTest: boolean;
  abstract readonly port: number;
  abstract readonly logLevel: string;
}
