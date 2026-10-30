export default defineEventHandler((event) => forward(event, `/api/orders/${segment(event, "id")}`));
