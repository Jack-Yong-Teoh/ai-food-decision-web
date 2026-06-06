import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { HttpMethod } from "./httpMethodType";
import { logger } from "./logger";

type RequestOptions = {
  endpoint: string;
  httpMethod?: HttpMethod;
  contentType?: string;
  stringifyBody?: string;
  formData?: FormData;
  baseUrl?: string;
  retry?: boolean;
};
const API_AUTH_BASE_URL = process.env.API_AUTH_BASE_URL;

// The function allowed the external request with cookie access_token and refresh_token
export async function httpExternalRequest({
  endpoint,
  httpMethod = "GET",
  contentType = "application/json",
  stringifyBody,
  formData,
  baseUrl,
  retry = false,
}: RequestOptions) {
  const startTime = Date.now();
  const timeout = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const { access_token, refresh_token } = await getAllToken();

  // 1. Build request options
  const isFormData = !!formData;
  const headers: HeadersInit = {
    ...(access_token && { Authorization: `Bearer ${access_token}` }),
  };
  if (!isFormData && contentType) {
    headers["Content-Type"] = contentType;
  }
  const body = isFormData ? formData : stringifyBody;

  // 2. Make Request to external API
  const response = await fetch(endpoint, {
    method: httpMethod,
    headers,
    body,
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  logger({ endpoint, httpMethod, response, startTime });

  // 3. Get the response details
  let data = null;
  if (
    response.status !== 204 &&
    response.headers.get("content-length") !== "0"
  ) {
    data = await response.json();
  }
  const bodyText = data ? JSON.stringify(data) : undefined;
  const responseHeaders = new Headers(response.headers);

  // Remove content-length/transfer-encoding headers from upstream
  // to avoid mismatches when we re-create the response body here.
  responseHeaders.delete("content-length");
  responseHeaders.delete("Content-Length");
  responseHeaders.delete("transfer-encoding");

  //  3.1 Condition 1: Login endpoint will set the tokens into cookies
  if (response.ok && endpoint.includes("login")) {
    await setAllToken(data, baseUrl);
    const res = new NextResponse(bodyText, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

    return res;
  }

  // 3.2 Condition 2: Call once refresh token when the status is 401
  if (response.status === 401 && !retry && !endpoint.includes("login")) {
    if (refresh_token) {
      const refreshResponse = await refreshTokenRequest(httpMethod, baseUrl);
      if (!refreshResponse.ok) {
        // When the refresh_token not exist.
        const response = redirectToLogin();
        // Clear all the token cookies
        await deleteAllToken();
        return response;
      }

      // Retrying to make the original request after set the new tokens
      return await httpExternalRequest({
        endpoint,
        httpMethod,
        stringifyBody,
        baseUrl,
        retry: true,
      });
    } else {
      // When the refresh_token not exist.
      const response = redirectToLogin();
      // Clear all the token cookies
      await deleteAllToken();
      return response;
    }
  }

  // 3.3 Condition 3: Guarantee the logout is always success and redirect to home page"
  if (endpoint.includes("logout")) {
    const response = NextResponse.json({ status: 200, redirectTo: "/" });
    // Clear all the token cookies
    await deleteAllToken();
    return response;
  }

  // 4. Create a new NextResponse with the raw body and status for common request
  const res = new NextResponse(bodyText || null, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });

  return res;
}

// This will be called when status is 401 Unauthorized,
// because it does not require injection of access_token so no need use httpExternalRequest
export async function refreshTokenRequest(
  httpMethod: HttpMethod,
  baseUrl?: string,
) {
  const startTime = Date.now();
  const timeout = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const { refresh_token } = await getAllToken();
  const endpoint = `${API_AUTH_BASE_URL}/authentication/token/refresh`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  logger({ endpoint, httpMethod, response, startTime });

  const data = await response.json();
  const bodyText = JSON.stringify(data);
  const headers = new Headers(response.headers);
  // Remove content-length/transfer-encoding headers from upstream
  // to avoid mismatches when recreating the response body here.
  headers.delete("content-length");
  headers.delete("Content-Length");
  headers.delete("transfer-encoding");
  await setAllToken(data, baseUrl);
  const res = new NextResponse(bodyText, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });

  return res;
}

function redirectToLogin() {
  return NextResponse.json(
    { message: "Unauthorized", redirectTo: "/recommend" },
    { status: 307 },
  );
}

// Token handler
const deleteAllToken = async () => {
  (await cookies()).delete("ACCESS_TOKEN");
  (await cookies()).delete("REFRESH_TOKEN");
};
const shouldUseSecureCookie = (baseUrl?: string) => {
  if (!baseUrl) {
    return process.env.NODE_ENV === "production";
  }

  try {
    return new URL(baseUrl).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
};
const setAllToken = async (data: {
  access_token: string;
  refresh_token: string;
}, baseUrl?: string) => {
  const cookieStore = await cookies();
  const secure = shouldUseSecureCookie(baseUrl);

  cookieStore.set("ACCESS_TOKEN", data.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("REFRESH_TOKEN", data.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  });
};
const getAllToken = async () => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("ACCESS_TOKEN")?.value;
  const refresh_token = cookieStore.get("REFRESH_TOKEN")?.value;
  return { access_token, refresh_token };
};
