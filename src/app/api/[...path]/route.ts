 
import { NextRequest, NextResponse } from "next/server";

import { convertToFormData } from "@/utils/apiHelper/formDataHandler";
import { httpExternalRequest } from "@/utils/apiHelper/httpExternalRequest";
import { HttpMethod } from "@/utils/apiHelper/httpMethodType";

const API_BASE_URL = process.env.API_BASE_URL;

// Notes:
// This will auto map the API string
// Example: "/api/user/profile" will be mapping to "<API_BASE_URL>/user/profile"

// Re-useable function to call httpExternalRequest
async function makeRequest(req: NextRequest) {
  try {
    // 1. Build external URL
    const path = req.nextUrl.pathname.replace("/api/", "");
    const query = req.nextUrl.searchParams.toString();
    const externalUrl = `${API_BASE_URL}/${path}${query ? `?${query}` : ""}`;

    let contentType = req.headers.get("content-type");

    // 2. Determine if content type is multipart
    const isMultipart = contentType?.includes("multipart/form-data");
    if (isMultipart) {
      contentType = "multipart/form-data";
    }

    // 3. Prepare request body
    let stringifyBody: string | null | undefined = null;
    let formData: FormData | null = null;

    if (req.method !== "GET") {
      if (isMultipart) {
        const rawFormData = await req.formData();
        formData = await convertToFormData(rawFormData);
      } else if (
        req.headers.get("content-type")?.includes("application/json")
      ) {
        try {
          const jsonBody = await req.json();

          stringifyBody = JSON.stringify(jsonBody);
        } catch (error: any) {
          console.warn("Empty or invalid JSON body", error);
          stringifyBody = undefined;
        }
      }
    }

    // 4. Construct request options
    const options = {
      endpoint: externalUrl,
      httpMethod: req.method as HttpMethod,
      ...(contentType && { contentType }),
      ...(stringifyBody && { stringifyBody }),
      ...(formData && { formData }),
      baseUrl: req.url,
    };

    // 4. Forward the request
    return await httpExternalRequest(options);
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = (req: NextRequest) => makeRequest(req);
export const POST = (req: NextRequest) => makeRequest(req);
export const PUT = (req: NextRequest) => makeRequest(req);
export const DELETE = (req: NextRequest) => makeRequest(req);
export const PATCH = (req: NextRequest) => makeRequest(req);
