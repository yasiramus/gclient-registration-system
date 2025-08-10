export interface LearnerFilters {
  trackId?: string;
  courseId?: string;
  paymentStatus?: "PAID" | "PARTIAL" | "PENDING";
}
