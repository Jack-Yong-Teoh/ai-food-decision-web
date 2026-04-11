import { HttpMethod } from "./httpMethodType";

export const logger = ({
  endpoint,
  httpMethod,
  response,
  startTime,
}: {
  endpoint: string;
  httpMethod: HttpMethod;
  response: Response;
  startTime: number;
}) => {
  console.log(
    "\x1b[36m%s\x1b[0m", // Cyan color for the label
    `[${new Date().toISOString()}] External API Call:`,
    {
      method: httpMethod, 
      endpoint,
      status: response.status,
      statusText: response.statusText,
      duration: `${Date.now() - startTime}ms`, // Add if you track request duration
      headers: Object.fromEntries(response.headers.entries()), // Log response headers
    }
  );
};
