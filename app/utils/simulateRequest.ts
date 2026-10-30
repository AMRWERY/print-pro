/**
 * Brief loading feedback for actions that don't call the API yet (newsletter, bookings, wishlist and
 * cart buttons). Orders, accounts and voucher checks use real requests instead.
 */
export const simulateRequest = (ms = 400) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
