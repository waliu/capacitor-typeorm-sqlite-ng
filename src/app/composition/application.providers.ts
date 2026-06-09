import {
  EnvironmentProviders,
  Provider,
} from '@angular/core';

import { provideUserServices } from './user.providers';

export function provideApplicationServices(): Array<EnvironmentProviders | Provider> {
  return [
    ...provideUserServices(),
  ];
}
