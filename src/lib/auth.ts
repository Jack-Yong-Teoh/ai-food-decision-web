import { cookies } from "next/headers";

export async function getIsLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ACCESS_TOKEN")?.value;

  return Boolean(token);
}
