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

export function fitsConstraints(obj, constr) {
  for (const property in constr) {
    if (Object.prototype.hasOwnProperty.call(constr, property)) {
      switch (constr[property].cmp) {
        case 0:
          if (obj[property] !== constr[property].val) return false;
          break;
        case 1:
          if (obj[property] > constr[property].val) return false;
          break;
        case 2:
          if (obj[property] < constr[property].val) return false;
          break;
      }
    }
  }
  return true;
}
