export async function postData(url = '', data = {}) {
  return await fetch(url, {
    method: 'POST',
    mode: "cors",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
}

export function debounce(timeout, fn) {
  let inDebounce = null;
  return (args) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => fn(args), timeout);
  }
}

export function throttle(timeout, fn) {
  let inThrottle = false;

  return args => {
    if (inThrottle) {
      return;
    }

    inThrottle = true;
    fn(args);
    setTimeout(() => {
      inThrottle = false;
    }, timeout);
  };
}
