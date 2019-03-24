import messages from 'generated/locales.json';
import React, { Consumer, Context, createContext, ReactNode, useContext } from 'react';
import { useLocale } from 'use-locale';
import { IntlProvider } from 'use-react-intl';
import { Timezone, useTimezone } from 'use-timezone';
import { cookieKeys, LanguageCode } from './config';

export interface AppContextProps {
  currentTimezone: string;
  currentLocale: LanguageCode;
  children: ReactNode;
}

export interface AppContextState {
  locale: LanguageCode;
  timezone: Timezone;
  
  updateLocale: (languageCode: LanguageCode) => void;
  updateTimezone: (timezone: string | Timezone) => void;
}

// @ts-ignore
const AppContext: Context<AppContextState> = createContext<AppContextState>();

export function AppContextProvider({children, currentLocale, currentTimezone}: AppContextProps) {
  const {locale, updateLocale} = useLocale(currentLocale, {cookieKey: cookieKeys.locale});
  const {timezone, updateTimezone} = useTimezone(currentTimezone, cookieKeys.timezone);
  
  return (
    <IntlProvider locale={locale.slice(0, 2)} messages={messages[locale]}>
      <AppContext.Provider value={{
        locale,
        timezone,
        updateLocale,
        updateTimezone,
      }}>
        {children}
      </AppContext.Provider>
    </IntlProvider>
  );
}

export function useAppContextState() {
  return useContext(AppContext);
}

export const AppContextConsumer: Consumer<AppContextState> = AppContext.Consumer;