export function parseLimit(searchParams: URLSearchParams, defaultLimit = 10, maxLimit = 50) {
  const rawLimit = Number(searchParams.get('limit') ?? defaultLimit);

  if (!Number.isFinite(rawLimit) || rawLimit <= 0) {
    return defaultLimit;
  }

  return Math.min(Math.floor(rawLimit), maxLimit);
}

export function optionalSearchParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key)?.trim();
  return value || undefined;
}
