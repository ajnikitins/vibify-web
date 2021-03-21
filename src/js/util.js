export async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: "cors",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  return response;
}
