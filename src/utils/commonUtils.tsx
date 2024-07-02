export function extractTraceFromError(errorMessage: Error["stack"]) {
  const lines = errorMessage!.split("\n");
  const trace = [];
  for (let line of lines) {
    const match = line.split("at ");
    if (match && match[1]) {
      trace.push(match[1]);
    }
  }
  return trace;
}

export const getCallingTrace = () => {
  const error = new Error();
  const stack = error.stack || "";
  const trace = extractTraceFromError(stack);
  return trace;
};

export function getHash(stackTrace: string[]) {
  let indexOfCallingComponent =
    stackTrace.findIndex(
      (line) =>
        line.startsWith("useTrackedQuery") ||
        line.startsWith("useTrackedLazyQuery")
    ) + 1;
  const str = stackTrace[indexOfCallingComponent];

  let hashValue = 0;
  const prime = 31; // we can use any random prime number
  const mod = 1e9 + 9;

  for (let i = 0; i < str.length; i++) {
    hashValue = (hashValue * prime + str.charCodeAt(i)) % mod;
  }

  return hashValue;
}
