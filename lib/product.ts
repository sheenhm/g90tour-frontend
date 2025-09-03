import { apiClient, PagedResponse, SearchParams, Review, ReviewRequest } from "@/lib/api";

export type Category = "HOTEL" | "GOLF" | "TOUR" | "SPA" | "VEHICLE" | "ACTIVITY";
export type Currency = "KRW" | "USD" | "VND" | "JPY" | "EUR" | "THB" | "CNY";

export const CurrencyLabels: Record<Currency, string> = {
    KRW: "한국 원",
    USD: "미국 달러",
    VND: "베트남 동",
    JPY: "일본 엔",
    EUR: "유로",
    THB: "태국 바트",
    CNY: "중국 위안",
};

// 공용 Product 타입
export interface Product {
    id: string;
    name: string;
    description: string;
    originalPrice: number;
    salePrice: number;
    category: Category;
    location: string;
    rating: number;
    includes: string[];
    imageUrl: string;
    isActive: boolean;
    createdAt: string;

    hotelDetails?: HotelDetails;
    golfDetails?: GolfDetails;
    tourDetails?: TourDetails;
    spaDetails?: SpaDetails;
    vehicleDetails?: VehicleDetails;
    activityDetails?: ActivityDetails;
}

// 카테고리별 상세 타입
export interface HotelDetails { capacity: number; roomType: string }
export interface GolfDetails { golfClubName: string[]; round: number; difficulty: string }
export interface TourDetails { tourType: string; departurePlace: string; durationDays: number; majorCities: string[]; majorSpots: string[] }
export interface SpaDetails { treatmentType: string; durationMinutes: number; treatmentOptions: string[]; facilities: string[] }
export interface VehicleDetails { vehicleType: string; carName: string; passengerCapacity: number; gasType: string; isDriverIncluded: boolean }
export interface ActivityDetails { activityType: string; reservationDeadline: string; activities: string[] }

export type ProductDetails =
    | { category: "HOTEL"; details: HotelDetails }
    | { category: "GOLF"; details: GolfDetails }
    | { category: "TOUR"; details: TourDetails }
    | { category: "SPA"; details: SpaDetails }
    | { category: "VEHICLE"; details: VehicleDetails }
    | { category: "ACTIVITY"; details: ActivityDetails };


export type ProductRequest = Omit<Product, 'id' | 'createdAt' | 'isActive' | 'rating'> & {
    costPrice: number
    currency: string
}
export type ProductForm = Omit<ProductRequest, "category"> & ProductDetails;

export const buildRequestFromForm = (form: ProductForm): ProductRequest => {
    const baseRequest: ProductRequest = {
        name: form.name,
        description: form.description,
        originalPrice: form.originalPrice,
        salePrice: form.salePrice,
        location: form.location,
        includes: form.includes,
        imageUrl: form.imageUrl,
        category: form.category,
        costPrice: form.costPrice,
        currency: form.currency,
    };

    const categoryKeyMap: Record<Category, keyof ProductRequest> = {
        HOTEL: "hotelDetails",
        GOLF: "golfDetails",
        SPA: "spaDetails",
        TOUR: "tourDetails",
        VEHICLE: "vehicleDetails",
        ACTIVITY: "activityDetails",
    };

    const key = categoryKeyMap[form.category];
    return key ? { ...baseRequest, [key]: form.details || {} } : baseRequest;
};

// formState를 ProductForm으로 변환
export const toProductForm = (form: Omit<ProductRequest, "category"> & {
    category: Category
    details: ProductDetails["details"]
    costPrice: number
    currency: string
}): ProductForm => {
    const categoryKeyMap: Record<Category, keyof ProductRequest> = {
        HOTEL: "hotelDetails",
        GOLF: "golfDetails",
        TOUR: "tourDetails",
        SPA: "spaDetails",
        VEHICLE: "vehicleDetails",
        ACTIVITY: "activityDetails",
    }

    const key = categoryKeyMap[form.category]

    return {
        ...form,
        [key]: form.details,
    } as ProductForm
}

// 일반 사용자용 상품 API
export const productApi = {
    getAll: async (): Promise<Product[]> => {
        return apiClient.get<Product[]>("/api/v1/products");
    },

    getById: async (id: string): Promise<Product> => {
        return apiClient.get<Product>(`/api/v1/products/${id}`);
    },

    search: async (params: SearchParams): Promise<PagedResponse<Product>> => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, v.toString()));
                } else {
                    searchParams.append(key, value.toString());
                }
            }
        });
        return apiClient.get<PagedResponse<Product>>(`/api/v1/products/search?${searchParams}`);
    },

    getReviews: async (productId: string) => {
        return apiClient.get<Review[]>(`/api/v1/products/${productId}/reviews`);
    },

    createReview: async (productId: string, data: ReviewRequest): Promise<void> => {
        return apiClient.post<void>(`/api/v1/products/${productId}/reviews`, data);
    },
}
