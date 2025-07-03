/**
 * A standard structure for all API responses.
 * Using a generic type `T` allows us to specify the shape of the `data` object
 * for each specific API route, ensuring type safety across the application.
 */
export type ApiResponse<T = Record<string, unknown>> = {
  data?: T;
  error?: {
    message: string;
    details?: unknown; // For sending back validation errors or other details
  };
};
