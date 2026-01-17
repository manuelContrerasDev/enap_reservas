function isAxiosError(err: unknown): err is {
  response?: { data?: any };
} {
  return typeof err === "object" && err !== null && "response" in err;
}
