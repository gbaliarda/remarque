export const apiEndpoint = "http://localhost:3000"

const checkStatus = async (res: Response) => {
  if (!res.ok) throw new Error(res.statusText)
  return res
}

export const apiFetcher = (resource: string, options: RequestInit) =>
  fetch(apiEndpoint + resource, options)
    .then(checkStatus)
    .then(res => res.json())

export const postJsonApi = (resource: string, body: Object) =>
  apiFetcher(resource, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  })
