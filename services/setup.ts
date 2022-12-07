export const apiEndpoint = process.env.NEXT_PUBLIC_BASE_URL

const checkStatus = async (res: Response) => {
  if (!res.ok) throw new Error(res.statusText)
  return res
}

export const apiFetcher = <T>(resource: string, options: RequestInit = {}) =>
  fetch(apiEndpoint + resource, options)
    .then(checkStatus)
    .then(res => res.json() as Promise<T>)

export const postJsonApi = <T>(resource: string, body: Object) =>
  apiFetcher<T>(resource, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  })

export const patchJsonApi = <T>(resource: string, body: Object) =>
  apiFetcher<T>(resource, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  })
