export function getArg(args: any, name: string): string | undefined {
  if (!args) return undefined;
  if (Array.isArray(args)) {
    const found = args.find((a: any) => a.name === name);
    return found ? found.value : undefined;
  }
  return args[name];
}

export function parseJsonArg<T>(args: any, name: string, fallback: T): T {
  const value = getArg(args, name);
  if (!value) return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
