"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, PrinterIcon as Print } from "lucide-react"

export default function TermsPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-navy-900">이용약관</h1>
          </div>
          <p className="text-gray-600">
            지구공투어가 제공하는 서비스에 관한 약관입니다.
            <br />
            서비스 이용 전 반드시 확인해주세요.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-navy-900">(주)지구공엔터테인먼트 서비스 이용약관</CardTitle>
            <p className="text-sm text-gray-600">시행일: 2024년 1월 1일</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 제1조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                이 약관은 (주)지구공엔터테인먼트(이하 "회사")가 제공하는 여행 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자
                간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <Separator />

            {/* 제2조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제2조 (정의)</h2>
              <div className="space-y-3">
                <p className="text-gray-700">이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>"서비스"라 함은 회사가 제공하는 모든 여행 관련 서비스를 의미합니다.</li>
                  <li>"이용자"라 함은 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                  <li>
                    "회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로
                    제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                  </li>
                  <li>"비회원"이라 함은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제3조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</p>
                <p>
                  ② 회사는 합리적인 사유가 발생할 경우에는 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수
                  있습니다.
                </p>
                <p>
                  ③ 약관이 변경되는 경우에는 변경된 약관의 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스의
                  초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                </p>
              </div>
            </section>

            <Separator />

            {/* 제4조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제4조 (회원가입)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서
                  회원가입을 신청합니다.
                </p>
                <p>
                  ② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로
                  등록합니다:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제5조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제5조 (서비스의 제공 및 변경)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 다음과 같은 업무를 수행합니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>여행 상품 정보 제공 및 예약 서비스</li>
                  <li>여행 관련 상담 및 고객지원 서비스</li>
                  <li>기타 회사가 정하는 업무</li>
                </ul>
                <p>② 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경할 수 있습니다.</p>
              </div>
            </section>

            <Separator />

            {/* 제6조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제6조 (서비스의 중단)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는
                  서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
                <p>
                  ② 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에
                  대하여 배상하지 않습니다.
                </p>
              </div>
            </section>

            <Separator />

            {/* 제7조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제7조 (회원탈퇴 및 자격상실)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.</p>
                <p>② 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                  <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                  <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제8조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제8조 (예약 및 계약)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 이용자는 서비스 상에서 다음 또는 이와 유사한 방법으로 예약을 신청하며, 회사는 이용자가 예약신청을
                  함에 있어서 다음의 내용을 알기 쉽게 제공하여야 합니다:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>여행상품의 검색 및 선택</li>
                  <li>성명, 연락처, 이메일 주소 등의 입력</li>
                  <li>약관내용, 청약철회권이 제한되는 서비스, 배송료 등의 비용부담과 관련한 내용에 대한 확인</li>
                  <li>이 약관에 동의하고 위 내용을 확인하거나 거부하는 표시</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제9조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제9조 (결제방법)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  서비스에서 구매한 여행상품에 대한 대금지급방법은 다음 각 호의 방법 중 가용한 방법으로 할 수 있습니다.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>폰뱅킹, 인터넷뱅킹 등의 각종 계좌이체</li>
                  <li>선불카드, 직불카드, 신용카드 등의 각종 카드 결제</li>
                  <li>온라인무통장입금</li>
                  <li>전자화폐에 의한 결제</li>
                  <li>기타 전자적 지급 방법에 의한 대금지급 등</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제10조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제10조 (취소 및 환불)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 이용자는 계약체결일 24시까지는 청약의 철회를 할 수 있습니다. 다만, 청약철회에 관하여 관련
                  법령에 달리 정함이 있는 경우에는 해당 법령이 정하는 바에 따릅니다.
                </p>
                <p>
                  ② 이용자는 여행상품을 배송받은 경우 다음 각 호의 하나에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>이용자에게 책임 있는 사유로 여행상품이 멸실 또는 훼손된 경우</li>
                  <li>이용자의 사용 또는 일부 소비에 의하여 여행상품의 가치가 현저히 감소한 경우</li>
                  <li>시간의 경과에 의하여 재판매가 곤란할 정도로 여행상품의 가치가 현저히 감소한 경우</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제11조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제11조 (개인정보보호)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
                </p>
                <p>② 회사는 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.</p>
                <p>
                  ③ 회사는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                </p>
              </div>
            </section>

            <Separator />

            {/* 제12조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제12조 (회사의 의무)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라
                  지속적이고, 안정적으로 여행상품을 제공하는데 최선을 다하여야 합니다.
                </p>
                <p>
                  ② 회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보보호를 위한 보안 시스템을
                  구축하여야 합니다.
                </p>
              </div>
            </section>

            <Separator />

            {/* 제13조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제13조 (회원의 의무)</h2>
              <div className="space-y-3 text-gray-700">
                <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>신청 또는 변경시 허위 내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사에 게시된 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>
                    외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는
                    행위
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제14조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제14조 (분쟁해결)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                  피해보상처리기구를 설치·운영합니다.
                </p>
                <p>
                  ② 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가
                  없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가
                  분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
                </p>
              </div>
            </section>

            <Separator />

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">본 약관은 2025년 9월 1일부터 시행됩니다.</p>
              <p className="text-sm text-gray-600 mt-2">(주)지구공엔터테인먼트 | 대표이사: 신근주 | 사업자등록번호: 563-88-03388</p>
              <p className="text-sm text-gray-600">주소: 서울특별시 강서구 마곡중앙6로 21, 727호 | 고객센터: 02-2662-2110</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}