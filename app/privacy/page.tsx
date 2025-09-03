"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shield, PrinterIcon as Print } from "lucide-react"

export default function PrivacyPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-navy-900">개인정보처리방침</h1>
          </div>
          <p className="text-gray-600">
            지구공투어는 고객님의 소중한 개인정보를 보호하기 위해 최선을 다하고 있습니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-navy-900">(주)지구공엔터테인먼트 개인정보처리방침</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 제1조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제1조 (개인정보의 처리목적)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (주)지구공엔터테인먼트(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의
                  목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 대한민국 「개인정보보호법」 제18조 등 관계 법령에 따라
                  별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>회원가입 및 관리:</strong> 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증,
                    회원자격 유지·관리, 서비스 부정이용 방지 목적으로 개인정보를 처리합니다.
                  </li>
                  <li>
                    <strong>여행서비스 제공:</strong> 여행상품 예약, 여행일정 안내, 여행관련 정보 제공, 본인인증,
                    요금결제·정산을 목적으로 개인정보를 처리합니다.
                  </li>
                  <li>
                    <strong>고객상담 및 민원처리:</strong> 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지,
                    처리결과 통보 목적으로 개인정보를 처리합니다.
                  </li>
                  <li>
                    <strong>마케팅 및 광고에의 활용:</strong> 신규 서비스(상품) 개발 및 맞춤 서비스 제공, 이벤트 및
                    광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의
                    유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제2조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
                  보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">처리목적</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">개인정보 항목</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">보유기간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">회원가입 및 관리</td>
                        <td className="border border-gray-300 px-4 py-2">이름, 이메일, 전화번호, 주소</td>
                        <td className="border border-gray-300 px-4 py-2">회원탈퇴 시까지</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">여행서비스 제공</td>
                        <td className="border border-gray-300 px-4 py-2">예약정보, 결제정보, 여권정보</td>
                        <td className="border border-gray-300 px-4 py-2">서비스 완료 후 5년</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">고객상담</td>
                        <td className="border border-gray-300 px-4 py-2">상담내용, 연락처</td>
                        <td className="border border-gray-300 px-4 py-2">상담 완료 후 3년</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">마케팅</td>
                        <td className="border border-gray-300 px-4 py-2">이메일, 전화번호, 서비스 이용기록</td>
                        <td className="border border-gray-300 px-4 py-2">동의철회 시까지</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <Separator />

            {/* 제3조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제3조 (개인정보의 제3자 제공)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며,
                  정보주체의 동의 또는 법률의 특별한 규정 등 「개인정보보호법」 제17조에 해당하는 경우에만 개인정보를 제3자에게
                  제공합니다.
                </p>
                <p>② 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:</p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">여행상품 제공업체</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 제공받는 자: 항공사, 호텔, 현지 여행사 등</li>
                    <li>• 제공목적: 여행상품 예약 및 서비스 제공</li>
                    <li>• 제공항목: 이름, 연락처, 여권정보, 예약정보</li>
                    <li>• 보유기간: 여행 완료 후 즉시 파기</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* 제4조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제4조 (개인정보처리의 위탁)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">위탁업무</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">위탁업체</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">위탁업무 내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">결제처리</td>
                        <td className="border border-gray-300 px-4 py-2">KG이니시스, 토스페이먼츠</td>
                        <td className="border border-gray-300 px-4 py-2">신용카드, 계좌이체 등 결제처리</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">SMS 발송</td>
                        <td className="border border-gray-300 px-4 py-2">알리고</td>
                        <td className="border border-gray-300 px-4 py-2">예약확인, 여행안내 SMS 발송</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">이메일 발송</td>
                        <td className="border border-gray-300 px-4 py-2">AWS SES</td>
                        <td className="border border-gray-300 px-4 py-2">예약확인, 마케팅 이메일 발송</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  ② 회사는 위탁계약 체결시 「개인정보보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지,
                  기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등의
                  문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
                </p>
              </div>
            </section>

            <Separator />

            {/* 제5조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제5조 (정보주체의 권리·의무 및 행사방법)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>개인정보 처리현황 통지요구</li>
                  <li>개인정보 열람요구</li>
                  <li>개인정보 정정·삭제요구</li>
                  <li>개인정보 처리정지요구</li>
                </ul>
                <p>
                  ② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며
                  회사는 이에 대해 지체없이 조치하겠습니다.
                </p>
                <p>
                  ③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할
                  때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
                </p>
              </div>
            </section>

            <Separator />

            {/* 제6조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제6조 (개인정보의 파기)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당
                  개인정보를 파기합니다.
                </p>
                <p>
                  ② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른
                  법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로
                  옮기거나 보관장소를 달리하여 보존합니다.
                </p>
                <p>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>파기절차:</strong> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보
                    보호책임자의 승인을 받아 개인정보를 파기합니다.
                  </li>
                  <li>
                    <strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
                    종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제7조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제7조 (개인정보의 안전성 확보조치)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를
                  하고 있습니다:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>개인정보 취급 직원의 최소화 및 교육:</strong> 개인정보를 취급하는 직원을 지정하고 담당자에
                    한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.
                  </li>
                  <li>
                    <strong>정기적인 자체 감사:</strong> 개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체
                    감사를 실시하고 있습니다.
                  </li>
                  <li>
                    <strong>내부관리계획의 수립 및 시행:</strong> 개인정보의 안전한 처리를 위하여 내부관리계획을
                    수립하고 시행하고 있습니다.
                  </li>
                  <li>
                    <strong>개인정보의 암호화:</strong> 이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어,
                    본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을 사용하는
                    등의 별도 보안기능을 사용하고 있습니다.
                  </li>
                  <li>
                    <strong>해킹 등에 대비한 기술적 대책:</strong> 회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보
                    유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이
                    통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.
                  </li>
                  <li>
                    <strong>개인정보에 대한 접근 제한:</strong> 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의
                    부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을
                    이용하여 외부로부터의 무단 접근을 통제하고 있습니다.
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* 제8조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제8조 (개인정보 보호책임자)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
                  피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
                </p>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-3">개인정보보호책임자</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>성명:</strong> 신하민
                    </p>
                    <p>
                      <strong>직책:</strong> 디지털부문장
                    </p>
                    <p>
                      <strong>연락처:</strong> 02-2662-2110,
                    </p>
                    <p>
                      <strong>이메일:</strong> help@g90tour.com
                    </p>
                  </div>
                </div>

                <p>
                  ② 정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
                  불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는
                  정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
                </p>
              </div>
            </section>

            <Separator />

            {/* 제9조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제9조 (권익침해 구제방법)</h2>
              <div className="space-y-3 text-gray-700">
                <p>정보주체는 아래의 기관에 대해 개인정보 침해에 대한 신고나 상담을 하실 수 있습니다:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">개인정보보호위원회</h4>
                    <div className="text-sm space-y-1">
                      <p>• 소관업무: 개인정보보호법 위반신고</p>
                      <p>• 신고전화: 국번없이 182</p>
                      <p>• 홈페이지: privacy.go.kr</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">개인정보보호 전문기관</h4>
                    <div className="text-sm space-y-1">
                      <p>• 소관업무: 개인정보보호 상담</p>
                      <p>• 상담전화: 국번없이 125</p>
                      <p>• 홈페이지: privacy.kisa.or.kr</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* 제10조 */}
            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-4">제10조 (개인정보 처리방침 변경)</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이
                  있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
              </div>
            </section>

            <Separator />

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">본 개인정보처리방침은 2025년 9월 1일부터 시행됩니다.</p>
              <p className="text-sm text-gray-600 mt-2">
                (주)지구공엔터테인먼트 | 개인정보보호책임자: 신하민 | 연락처: help@g90tour.com
              </p>
              <p className="text-sm text-gray-600">주소: 서울특별시 강서구 마곡중앙6로 21, 727호 | 고객센터: 02-2662-2110</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}