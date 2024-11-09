import Pino from 'pino'
import UserProvider from '../providers/user-provider'

import '@remix-run/server-runtime'
import '@remix-run/node'

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    log: Pino.Logger
  }
}

declare module '@remix-run/node' {
  export interface ActionArgs extends DataFunctionArgs {
    context: {
      log: Pino.Logger
    }
  }
  export interface LoaderArgs {
    context: {
      log: Pino.Logger
    }
  }
}
