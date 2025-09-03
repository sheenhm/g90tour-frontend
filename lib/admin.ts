import { apiClient, User, PagedResponse, SearchParams, UrlResponse } from "@/lib/api"
import { Product } from "./product"

const toQueryString = (params: Record<string, any>) =>
    new URLSearchParams(
        Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
    ).toString();

// --- DTO 정의 ---
export interface TopProduct { productId: string; productName: string; bookingCount: number; }
export interface DashboardSummary { totalUsers: number; newUsersLast7Days: number; totalBookings: number; newBookingsLast7Days: number; totalRevenue: number; revenueLast7Days: number; activeProducts: number; top5Products: TopProduct[]; }
export interface Booking { id: string; userId: string; customerName: string; productId: string; productName: string; travelDate: string; travelers: number; originalPrice: number; discountedAmount: number; totalPrice: number; status: "QUOTE_REQUESTED" | "PAYMENT_PENDING" | "PAYMENT_COMPLETED" | "TRAVEL_COMPLETED" | "CANCEL_PENDING" | "CANCELLED"; specialRequests?: string; createdAt: string; }
export interface AdminUsersPageResponse extends PagedResponse<User> {}
export type CouponType = "AMOUNT" | "RATE";
export interface Coupon { id: number; code: string; description: string; discountType: CouponType; discountAmount?: number; discountRate?: number; maxDiscountAmount?: number; status: string; expiryDate: string; }
export interface UserCoupon { userCouponId: number; code: string; description: string; discountType: CouponType; discountAmount?: number; discountRate?: number; maxDiscountAmount?: number; expiryDate: string; isUsed: boolean; usedAt?: string; }
export interface CouponCreateRequest { description: string; discountType: CouponType; discountAmount?: number; discountRate?: number; maxDiscountAmount?: number; expiryDate: string; }
export interface CouponGrantRequest { userId: string; couponId: number; }
export type InquiryStatus = "PENDING" | "RESPONDED" | "CLOSED";
export interface Inquiry { id: number; userName?: string; title: string; content: string; nonMemberName?: string; nonMemberEmail?: string; nonMemberPhone?: string; status: InquiryStatus; response?: string; respondedAt?: string; createdAt: string; }
export interface InquiryResponseRequest { response: string; }
export interface InquiryCreateRequest { title: string; content: string; nonMemberName?: string; nonMemberEmail?: string; nonMemberPhone?: string; category?: string; }
export interface Faq { id: number; question: string; answer: string; category?: string; }
export interface FaqCreateRequest { question: string; answer: string; category?: string; }
export interface Notice { id: number; title: string; content: string; category: string; views: number; createdAt: string; active: boolean; pinned: boolean; }
export interface NoticeCreateRequest { title: string; content: string; category: string; active: boolean; pinned: boolean; }

export const adminDashboardApi = {
    getSummary: () => apiClient.get<DashboardSummary>("/api/v1/admin/dashboard/summary"),
};

export const adminBookingApi = {
    getRecent: (page = 0, size = 5) =>
        apiClient.get<{ content: Booking[] }>(`/api/v1/admin/bookings?${toQueryString({ page, size })}`)
            .then(res => res.content || []),
    approve: (bookingId: string) => apiClient.post(`/api/v1/admin/bookings/${bookingId}/approve`),
    confirmCancellation: (bookingId: string) => apiClient.post(`/api/v1/admin/bookings/${bookingId}/confirm-cancellation`),
    downloadQuotationPdf: (bookingId: string): Promise<Blob> =>
        apiClient.get(`/api/v1/admin/bookings/${bookingId}/quotation/download`, {}, true),
    sendQuotationEmail: (bookingId: string) => apiClient.post(`/api/v1/admin/bookings/${bookingId}/quotation/send-email`),
};

export const adminUserApi = {
    getAll: (page = 0, size = 10) =>
        apiClient.get<AdminUsersPageResponse>(`/api/v1/admin/users?${toQueryString({ page, size })}`),
    deactivate: (userId: string) => apiClient.patch(`/api/v1/admin/users/${userId}/deactivate`),
};

export const adminProductApi = {
    getAll: () => apiClient.get<Product[]>("/api/v1/admin/products"),
    getById: (id: string) => apiClient.get<Product>(`/api/v1/admin/products/${id}`),
    search: (params: SearchParams) =>
        apiClient.get<PagedResponse<Product>>(`/api/v1/admin/products/search?${toQueryString(params)}`),
    create: (product: FormData) => apiClient.post<Product>("/api/v1/admin/products", product),
    update: (id: string, product: FormData) => apiClient.put<Product>(`/api/v1/admin/products/${id}`, product),
    delete: (id: string) => apiClient.delete(`/api/v1/admin/products/${id}`),
};

export const adminFileApi = {
    uploadPublicFile: (file: File, path: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", path);
        formData.append("isPrivate", "false");
        return apiClient.post<UrlResponse>("/api/v1/files/upload", formData);
    },
};

export const adminCouponApi = {
    issue: (coupon: CouponCreateRequest) => apiClient.post<Coupon>("/api/v1/admin/coupons", coupon),
    getAll: () => apiClient.get<Coupon[]>("/api/v1/admin/coupons"),
    revoke: (couponId: number) => apiClient.patch(`/api/v1/admin/coupons/${couponId}/revoke`),
    grantToUser: (userId: string, couponId: number) =>
        apiClient.post<UserCoupon>("/api/v1/admin/users/coupons", { userId, couponId }),
    getUserCoupons: (userId: string) => apiClient.get<UserCoupon[]>(`/api/v1/admin/users/${userId}/coupons`),
    revokeFromUser: (userCouponId: number) => apiClient.delete(`/api/v1/admin/users/coupons/${userCouponId}`),
};

export const adminInquiryApi = {
    getByStatus: (status: InquiryStatus) => apiClient.get<Inquiry[]>(`/api/v1/admin/inquiries?status=${status}`),
    respond: (inquiryId: number, response: string) =>
        apiClient.patch(`/api/v1/admin/inquiries/${inquiryId}/respond`, { response }),
};

export const adminFaqApi = {
    create: (faq: FaqCreateRequest) => apiClient.post<Faq>("/api/v1/admin/support/faq", faq),
    getAll: () => apiClient.get<Faq[]>("/api/v1/support/faq?category=all"),
    update: (id: number, faq: FaqCreateRequest) => apiClient.put<Faq>(`/api/v1/admin/support/faq/${id}`, faq),
    delete: (id: number) => apiClient.delete(`/api/v1/admin/support/faq/${id}`),
};

export const adminNoticeApi = {
    getAll: () => apiClient.get<Notice[]>("/api/v1/admin/support/notices"),
    create: (data: NoticeCreateRequest) => apiClient.post<Notice>("/api/v1/admin/support/notices", data),
    update: (id: number, data: NoticeCreateRequest) => apiClient.put<Notice>(`/api/v1/admin/support/notices/${id}`, data),
    delete: (id: number) => apiClient.delete(`/api/v1/admin/support/notices/${id}`),
};