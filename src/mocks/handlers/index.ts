import { RequestHandler } from 'msw'
import { cashflowHandlers } from './cashflow'

// Array gabungan yang bertipe RequestHandler[]
export const handlers: RequestHandler[] = [
  // ...usersHandlers,
  ...cashflowHandlers,
]
