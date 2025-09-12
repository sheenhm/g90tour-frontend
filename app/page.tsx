"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { productApi, type Product } from "@/lib/api"
import ProductCard from "@/components/MainProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Building, TreePine, Plane, Waves, Dumbbell, Car, Search, ShieldCheck, Users, Map } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card";

const categories = [
    { name: "프리미엄 호텔", icon: Building, href: "/hotels", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" },
    { name: "프라이빗 골프", icon: TreePine, href: "/golf", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop" },
    { name: "럭셔리 패키지", icon: Plane, href: "/tours", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop" },
    { name: "릴렉싱 스파", icon: Waves, href: "/spa", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop" },
    { name: "익사이팅 액티비티", icon: Dumbbell, href: "/activities", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop" },
    { name: "편안한 차량", icon: Car, href: "/vehicles", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" },
]

const whyUsItems = [
    { icon: Users, title: "전문가 맞춤 설계", description: "여행 전문가가 당신만을 위한 완벽한 일정을 만들어 드립니다." },
    { icon: ShieldCheck, title: "안전하고 프라이빗하게", description: "검증된 파트너와 함께 안전하고 프라이빗한 여행을 보장합니다." },
    { icon: Map, title: "세상의 모든 여행지", description: "숨겨진 보석같은 여행지부터 최고의 럭셔리 여행지까지." },
]

const testimonials = [
    { quote: "G90 덕분에 가족 모두에게 잊지 못할 최고의 여행이 되었어요. 다음 여행도 기대됩니다!", author: "김민준", location: "하와이, 2024" },
    { quote: "상상했던 것 이상의 프라이빗 골프 투어였습니다. 완벽한 코스와 세심한 배려에 감동했습니다.", author: "이서연", location: "다낭, 2024" },
]


// --- Sub-components ---

const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
)


// --- Main Component ---

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true)
                const products = await productApi.getAll()
                // Sort by rating to feature popular products
                const sortedProducts = products.sort((a, b) => b.rating - a.rating)
                setFeaturedProducts(sortedProducts.slice(0, 4))
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-gray-800">
            {/* Hero Section */}
            <section className="relative h-[600px] lg:h-screen w-full overflow-hidden flex items-center justify-center">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/lending.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 tracking-tight"
                    >
                        당신만의 특별한 여정
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg lg:text-2xl mb-8 max-w-3xl mx-auto text-gray-200"
                    >
                        G90 Tour와 함께 세상에 없던 프리미엄 여행을 경험하세요.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="max-w-2xl mx-auto mt-8 bg-white/20 backdrop-blur-sm p-4 rounded-xl"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <Input
                                type="text"
                                placeholder="어디로 떠나고 싶으신가요? (예: 다낭, 하와이)"
                                className="w-full text-base bg-white/90 text-gray-800 placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-teal-500"
                            />
                            <Button size="lg" className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white">
                                <Search className="w-5 h-5 mr-2" /> 검색
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Category Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y:20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <h2 className="text-3xl font-bold text-center mb-4">완벽한 여행을 위한 테마</h2>
                        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">최고급 호텔부터 프라이빗 골프까지, 당신의 스타일에 맞는 여행을 선택하세요.</p>
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {categories.map((category) => (
                            <motion.div key={category.name} variants={itemVariants}>
                                <Link href={category.href} className="group block relative h-40 rounded-xl overflow-hidden shadow-lg">
                                    <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110"/>
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                        <category.icon className="w-8 h-8 mb-2" />
                                        <span className="font-semibold text-center">{category.name}</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y:20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <h2 className="text-3xl font-bold text-center mb-4">지금 가장 사랑받는 여행</h2>
                        <p className="text-center text-gray-600 mb-12">고객님들이 직접 선택한 인기 상품을 만나보세요.</p>
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => <motion.div key={i} variants={itemVariants}><ProductCardSkeleton /></motion.div>)
                            : featuredProducts.map((product) => (
                                <motion.div key={product.id} variants={itemVariants}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))
                        }
                    </motion.div>
                    <div className="text-center mt-12">
                        <Button size="lg" asChild className="bg-navy-600 hover:bg-navy-700">
                            <Link href="/products">모든 상품 보기</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y:20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <h2 className="text-3xl font-bold text-center mb-4">G90 Tour는 다릅니다</h2>
                        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">오직 당신만을 위한 최고의 여행을 만들기 위해 G90 Tour는 모든 순간에 함께합니다.</p>
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {whyUsItems.map((item) => (
                            <motion.div key={item.title} variants={itemVariants}>
                                <div className="text-center p-8 bg-slate-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="inline-block bg-teal-100 text-teal-600 p-4 rounded-full mb-4">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y:20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <h2 className="text-3xl font-bold text-center mb-12">고객님들의 찬사</h2>
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Card className="bg-white shadow-lg">
                                    <CardContent className="p-8">
                                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mb-4" />
                                        <p className="text-lg text-gray-700 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                                        <div className="text-right">
                                            <p className="font-bold">{testimonial.author}</p>
                                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    )
}