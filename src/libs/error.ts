// eslint-disable-next-line max-classes-per-file
export class TokenError extends Error {}

export class ErrorHelper {
  static parse(error: any): Error {
    const networkError = error.graphQLErrors;
    if (networkError && Array.isArray(networkError)) {
      const msg = networkError.map((row) => row.message).join(", ");

      if (networkError.some((row) => row?.code === "invalid_token")) {
        return new TokenError(msg);
      }

      return new Error(msg);
    }

    return error;
  }
}
