export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>© 2024 G90 Travel Admin</span>
          <span>•</span>
          <span>Version 1.2.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span>서버 상태: 정상</span>
          <span>•</span>
          <span>마지막 업데이트: 2024-02-28</span>
        </div>
      </div>
    </footer>
  )
}
