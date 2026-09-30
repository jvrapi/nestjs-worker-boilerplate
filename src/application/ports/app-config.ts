export abstract class AppConfig {
  abstract readonly appName: string;
  abstract readonly isProduction: boolean;
  abstract readonly isTest: boolean;
}
