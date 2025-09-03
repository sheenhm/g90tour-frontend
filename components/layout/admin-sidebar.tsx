"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const menuItems = [
  {
    title: "대시보드",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "상품 관리",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "예약 관리",
    href: "/admin/bookings",
    icon: Calendar,
    badge: "12",
  },
  {
    title: "회원 관리",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "고객센터",
    icon: MessageSquare,
    children: [
      { title: "공지사항", href: "/admin/support/notices" },
      { title: "문의 관리", href: "/admin/support/inquiries", badge: "5" },
      { title: "FAQ 관리", href: "/admin/support/faq" }
    ],
  },
  {
    title: "통계 분석",
    href: "/admin/analytics",
    icon: BarChart3,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["고객센터"])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href: string) => {
    return pathname === href || (href !== "/admin" && pathname.startsWith(href))
  }

  return (
    <aside className="w-64 bg-navy-900 text-white min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G90</span>
          </div>
          <span className="text-xl font-bold">지구공투어</span>
        </Link>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-between text-left text-white hover:bg-navy-800 ${
                      item.children.some((child) => isActive(child.href)) ? "bg-navy-800" : ""
                    }`}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  {expandedItems.includes(item.title) && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Button
                            asChild
                            variant="ghost"
                            className={`w-full justify-start text-left text-gray-300 hover:bg-navy-800 hover:text-white ${
                              isActive(child.href) ? "bg-navy-800 text-white" : ""
                            }`}
                          >
                            <Link href={child.href} className="flex items-center justify-between">
                              <span>{child.title}</span>
                              {child.badge && <Badge className="bg-red-600 text-white text-xs">{child.badge}</Badge>}
                            </Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  className={`w-full justify-start text-left text-white hover:bg-navy-800 ${
                    isActive(item.href) ? "bg-navy-800" : ""
                  }`}
                >
                  <Link href={item.href} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && <Badge className="bg-red-600 text-white text-xs">{item.badge}</Badge>}
                  </Link>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
