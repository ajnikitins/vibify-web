export function createAuthorizationURL(cfg) {
  const params = new URLSearchParams('');

  params.set('client_id', cfg.id);
  params.set('response_type', 'code');
  params.set('redirect_uri', cfg.redirect_uri);
  params.set('state', cfg.state);
  params.set('scope', cfg.scope.join(' '));

  return `${cfg.host}${cfg.path}?` + params;
}
