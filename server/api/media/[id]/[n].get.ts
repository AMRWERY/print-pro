// Product photos uploaded in admin. The API serves each as a real image; this passes it on to the browser
// with the same long cache, so product cards and galleries can use a plain <img src="/api/media/...">.
export default defineEventHandler(async (event) => {
  const base = String(useRuntimeConfig().apiBase).replace(/\/+$/, "");
  const id = segment(event, "id");
  const n = segment(event, "n");
  try {
    const res = await $fetch.raw<ArrayBuffer>(`${base}/api/media/${id}/${n}`, { responseType: "arrayBuffer" });
    setResponseHeaders(event, {
      "content-type": res.headers.get("content-type") ?? "image/jpeg",
      "cache-control": res.headers.get("cache-control") ?? "public, max-age=3600",
    });
    return Buffer.from(res._data as ArrayBuffer);
  } catch {
    throw createError({ statusCode: 404, message: "Not found" });
  }
});
