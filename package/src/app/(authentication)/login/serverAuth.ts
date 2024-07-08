// serverAuth.ts
"use server";

import { signIn } from "../../../../auth";

export async function signInWithCredentials(formData: any) {
  await signIn("credentials", formData);
}
