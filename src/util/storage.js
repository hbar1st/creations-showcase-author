export function setToken(token) {
  localStorage.setItem("cs-hb-jwt", token);
}

export function getToken() {
  return localStorage.getItem("cs-hb-jwt");
}

export function clearToken() {
  console.trace("clearToken")
  localStorage.removeItem("cs-hb-jwt");
}
