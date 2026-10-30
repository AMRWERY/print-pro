// Creates the account only. The customer signs in afterwards, as the sign-up form already expects.
export default defineEventHandler(async (event) => {
  await callApi(event, "/api/auth/register", { method: "POST", body: await readBody(event) });
  setResponseStatus(event, 201);
  return { ok: true };
});
