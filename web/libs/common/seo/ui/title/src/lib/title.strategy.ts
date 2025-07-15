import {
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const APP_TITLE = new InjectionToken<string>('App');
const APP_TITLE_SEPARATOR = new InjectionToken<string>('App Title Separator');

const defaultSeparator = '|';

export function provideAppTitle(
  title: string,
  options?: {
    separator?: string;
  },
) {
  const providers: (Provider | EnvironmentProviders)[] = [
    { provide: APP_TITLE, useValue: title },
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ];
  if (options?.separator) {
    providers.push({
      provide: APP_TITLE_SEPARATOR,
      useValue: options.separator,
    });
  }
  return makeEnvironmentProviders(providers);
}

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  readonly #title = inject(Title);
  readonly #appTitle = inject(APP_TITLE);
  readonly #separator =
    inject(APP_TITLE_SEPARATOR, {
      optional: true,
    }) ?? defaultSeparator;

  override updateTitle(snapshot: RouterStateSnapshot) {
    const title = this.buildTitle(snapshot);
    if (title) {
      this.#title.setTitle(`${title} ${this.#separator} ${this.#appTitle}`);
    } else {
      this.#title.setTitle(`${this.#appTitle}`);
    }
  }
}
