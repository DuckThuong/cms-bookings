export const BookingEndPoints = {
  LIST: "/cms/booking",
  DETAIL: (paymentId: number) => `/cms/booking/${paymentId}`,
  CONFIRM: (paymentId: number) => `/cms/booking/${paymentId}/confirm`,
  REJECT: (paymentId: number) => `/cms/booking/${paymentId}/reject`,
};
