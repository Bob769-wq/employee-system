export interface AngularGeneratorSchema {
  app: string;
  domain: string;
  type: 'data-access' | 'feature' | 'ui' | 'utils' | 'api';
  name: string;
}
