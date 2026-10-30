export default defineEventHandler((event) => forward(event, `/api/products/${segment(event, "id")}`));
