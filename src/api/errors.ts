import axios from 'axios'
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map((item) => item.msg).join('; ')
    return error.response ? `Ошибка сервиса: ${error.response.status}` : 'Сервис недоступен. Проверьте подключение.'
  }
  return error instanceof Error ? error.message : 'Не удалось выполнить запрос'
}
export function unavailable(error: unknown) {
  return axios.isAxiosError(error) && (!error.response || error.response.status >= 500)
}
