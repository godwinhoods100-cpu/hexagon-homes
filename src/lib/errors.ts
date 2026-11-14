import { ApiError } from "../api"

export type LoadError = { message: string; status?: number }

/** Turn anything thrown by an API call into a message a person can read. */
export function describeError(error: unknown): LoadError {
  if (error instanceof ApiError)
    return { message: error.message, status: error.status }
  if (error instanceof TypeError)
    return { message: "Cannot reach the server. Check that the API is running." }
  return { message: "Something went wrong. Please try again." }
}
