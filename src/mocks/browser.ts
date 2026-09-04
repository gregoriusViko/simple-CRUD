import { setupWorker } from 'msw/browser'
import { handlers } from './handlers/index' // Mengimpor semua endpoint

export const worker = setupWorker(...handlers)
