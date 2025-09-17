const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://g90tour-backend-cg0l.onrender.com";

// --- API 클라이언트 설정 ---
class ApiClient {
    private readonly baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        if (typeof window !== "undefined") {
            this.token = localStorage.getItem("accessToken");
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
        }
    }

    private async request<T>(endpoint: string,
                             options: RequestInit = {},
                             isBlob: boolean = false
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = new Headers(options.headers);

        if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        if (this.token) {
            headers.set("Authorization", `Bearer ${this.token}`);
        }

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            if (response.status === 401) {
                this.clearToken();
                throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
            }

            const text = await response.text();
            let errorMessage: string;
            try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || text;
            } catch {
                errorMessage = text || `HTTP error! status: ${response.status}`;
            }
            throw { status: response.status, message: errorMessage };
        }

        if (response.status === 204) {
            return null as T;
        }

        return isBlob ? (await response.blob()) as T : (await response.json()) as T;
    }

    async get<T>(endpoint: string, options: RequestInit = {}, isBlob: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: "GET", ...options }, isBlob);
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: this.formatBody(data),
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: this.formatBody(data),
        });
    }

    async patch<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: this.formatBody(data),
        });
    }

    async delete(endpoint: string): Promise<void> {
        return this.request<void>(endpoint, { method: "DELETE" });
    }

    private formatBody(data?: any): BodyInit | undefined {
        if (!data) return undefined;
        return data instanceof FormData ? data : JSON.stringify(data);
    }

}

const apiClient = new ApiClient(API_BASE_URL);
export { apiClient };

// --- 타입 정의 ---
export * from "./product"; // Product 관련 타입 및 API
export interface User { id: string; email: string; name: string; phone: string; birth: string; gender: 'MALE' | 'FEMALE'; role: "USER" | "ADMIN"; grade: 'BRONZE' | 'SILVER' | 'GOLD'; totalSpent: number; createdAt: string; lastLoginAt: string; }
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { grantType: string; accessToken: string; }
export interface SignupRequest { email: string; password: string; name: string; phone: string; birth: string; gender: "MALE" | "FEMALE"; }
export interface SignupResponse { message: string }
export interface MyPageInfo { userId: string; name: string; email: string; phone: string; birth: string; gender: "MALE" | "FEMALE"; grade: string; totalSpent: number; totalBookings: number; bookingHistory: BookingResponse[]; }
export interface Coupon { description: string; discountType: "FIXED_AMOUNT" | "PERCENTAGE"; discountAmount: number; discountRate: number; maxDiscountAmount: number; status: "ACTIVE" | "EXPIRED" | "USED" | "REVOKED"; expiryDate: string; }
export interface MyCoupon { userCouponId: number; coupon: Coupon }
export interface BookingRequest { productId: string; travelDate: string; counts: number; specialRequests?: string; appliedUserCouponId?: number; }
export interface BookingResponse { bookingId: string; userId: string; customerName: string; productId: string; productName: string; travelDate: string; counts: number; originalPrice: number; discountedAmount: number; totalPrice: number; status: "QUOTE_REQUESTED" | "PAYMENT_PENDING" | "PAYMENT_COMPLETED" | "TRAVEL_COMPLETED" | "CANCEL_PENDING" | "CANCELLED"; specialRequests?: string; createdAt: string; }
export interface PaymentPageResponse { bookingId: string; name: string; travelDate: string; productName: string; productType: string; originalPrice: number; discountedAmount: number; finalPrice: number; status: "PAYMENT_PENDING" | "PAYMENT_COMPLETED"; }
export interface Review { id: number; authorName: string; rating: 1 | 2 | 3 | 4 | 5; content: string; createdAt: string; }
export interface ReviewRequest { rating: number; content: string; }
export interface ProductSearchParams { keyword?: string; category?: string; minPrice?: number; maxPrice?: number; page?: number; size?: number; sort?: string; }
export interface PagedResponse<T> { content: T[]; pageNumber: number; pageSize: number; totalPages: number; totalElements: number; isFirst: boolean; isLast: boolean; }
export interface Notice { id: number; title: string; content: string; category: string; views: number; createdAt: string; active: boolean; pinned: boolean; }
export interface Faq { id: number; question: string; answer: string; category: string; }
export interface InquiryRequest { category: string; title: string; content: string; nonMemberName?: string; nonMemberEmail?: string; nonMemberPhone?: string; }
export interface UrlResponse { url: string; }
export interface TravelerRequest { name: string; nameEngFirst: string; nameEngLast: string; gender: 'MALE' | 'FEMALE'; birth: string; phone: string; passportNumber: string; passportUrl?: string; }
export interface TravelerResponse { id: string; name: string; nameEngFirst: string; nameEngLast: string; gender: 'MALE' | 'FEMALE'; birth: string; phone: string; passportNumber: string; passportUrl?: string; }

// --- Auth API ---
export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const res = await apiClient.post<LoginResponse>("/api/v1/users/login", data);
        apiClient.setToken(res.accessToken);
        return res;
    },
    signup: (data: SignupRequest) => apiClient.post<SignupResponse>("/api/v1/users/signup", data),
    getUserInfo: () => apiClient.get<User>("/api/v1/users/me"),
    updatePhone: (userId: string, phone: string) => apiClient.put<void>(`/api/v1/users/${userId}/phone`, { phone }),
    changePassword: (userId: string, data: { currentPassword: string; newPassword: string }) => apiClient.patch<void>(`/api/v1/users/${userId}/password`, data),
    deleteAccount: (userId: string) => apiClient.delete(`/api/v1/users/${userId}`),
    requestPasswordReset: (email: string) => apiClient.post<void>("/api/v1/users/password-reset/request", { email }),
    confirmPasswordReset: (token: string, newPassword: string) => apiClient.post<void>("/api/v1/users/password-reset/confirm", { token, newPassword }),
    logout: () => apiClient.clearToken(),
};

// --- Booking API ---
export const bookingApi = {
    request: (data: BookingRequest) => apiClient.post<BookingResponse>("/api/v1/bookings/request", data),
    cancel: (bookingId: string) => apiClient.patch<void>(`/api/v1/bookings/${bookingId}/cancel`),
    getPaymentPage: (bookingId: string) => apiClient.get<PaymentPageResponse>(`/api/v1/bookings/${bookingId}/pay`),
    paymentComplete: (bookingId: string) => apiClient.post<BookingResponse>(`/api/v1/bookings/${bookingId}/pay/complete`),
    getById: (bookingId: string) => apiClient.get<BookingResponse>(`/api/v1/bookings/${bookingId}`)
};

// --- MyPage API ---
export const mypageApi = {
    getInfo: (): Promise<MyPageInfo> => apiClient.get<MyPageInfo>("/api/v1/mypage")
};

// --- Coupon API ---
export const couponApi = {
    getMyCoupons: (): Promise<MyCoupon[]> => apiClient.get<MyCoupon[]>("/api/v1/coupons/my"),
    registerCoupon: (couponCode: string) => apiClient.post<MyCoupon>("/api/v1/coupons/register", { couponCode }),
};

// --- Support API ---
export const supportApi = {
    getNotices: (page: number = 0, size: number = 10): Promise<PagedResponse<Notice>> => {
        return apiClient.get<PagedResponse<Notice>>(`/api/v1/support/notices?page=${page}&size=${size}`);
    },
    getNoticeById: (id: number): Promise<Notice> => {
        return apiClient.get<Notice>(`/api/v1/support/notices/${id}`);
    },
    getFaqs: (category: string): Promise<Faq[]> => {
        return apiClient.get<Faq[]>(`/api/v1/support/faq?category=${category}`);
    },
    submitInquiry: (data: InquiryRequest) => apiClient.post<void>("/api/v1/support/inquiry", data),
};

// --- File API ---
export const fileApi = {
    uploadFile: (file: File, path: string, isPrivate: boolean = true): Promise<UrlResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", path);
        formData.append("isPrivate", String(isPrivate));
        return apiClient.post<UrlResponse>("/api/v1/files/upload", formData);
    },
    getPresignedUrl: (fileKey: string): Promise<UrlResponse> => {
        return apiClient.get<UrlResponse>(`/api/v1/files/download?fileKey=${encodeURIComponent(fileKey)}`);
    },
};

// --- Traveler API ---
export const travelerApi = {
    addTraveler: (bookingId: string, data: TravelerRequest): Promise<TravelerResponse> => {
        return apiClient.post(`/api/bookings/${bookingId}/travelers`, data);
    },
    getTravelers: (bookingId: string): Promise<TravelerResponse[]> => {
        return apiClient.get(`/api/bookings/${bookingId}/travelers`);
    },
    removeTraveler: (bookingId: string, travelerId: string): Promise<void> => {
        return apiClient.delete(`/api/bookings/${bookingId}/travelers/${travelerId}`);
    },
};