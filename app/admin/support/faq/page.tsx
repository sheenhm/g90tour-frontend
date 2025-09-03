"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { adminFaqApi, Faq, FaqCreateRequest } from "@/lib/admin";
import { toast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 새로운 FAQ 카테고리 정의
const FAQ_CATEGORIES = [
    { id: "all", name: "전체" },
    { id: "booking", name: "예약/결제" },
    { id: "travel", name: "여행 정보" },
    { id: "cancel", name: "취소/환불" },
    { id: "account", name: "계정/회원" },
    { id: "other", name: "기타" },
];

export default function FaqAdminPage() {
    const [allFaqs, setAllFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentFaq, setCurrentFaq] = useState<Faq | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("all");

    // FAQ 목록을 불러오는 함수
    const fetchFaqs = async () => {
        try {
            setIsLoading(true);
            const data = await adminFaqApi.getAll();
            setAllFaqs(data);
        } catch (error) {
            toast({
                title: "오류",
                description: "FAQ 목록을 불러오는 데 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 FAQ 목록 불러오기
    useEffect(() => {
        fetchFaqs();
    }, []);

    // 선택된 카테고리에 따라 FAQ 목록을 필터링
    const filteredFaqs = useMemo(() => {
        if (selectedCategory === "all") {
            return allFaqs;
        }
        return allFaqs.filter(faq => faq.category?.toLowerCase() === selectedCategory);
    }, [selectedCategory, allFaqs]);

    // '새 FAQ 등록' 버튼 클릭 핸들러
    const handleCreate = () => {
        setCurrentFaq(null);
        setIsDialogOpen(true);
    };

    // '수정' 버튼 클릭 핸들러
    const handleEdit = (faq: Faq) => {
        setCurrentFaq(faq);
        setIsDialogOpen(true);
    };

    // '삭제' 버튼 클릭 핸들러
    const handleDeleteClick = (faq: Faq) => {
        setFaqToDelete(faq);
        setIsAlertOpen(true);
    };

    // 삭제 확인 대화상자에서 '삭제' 버튼 클릭 핸들러
    const handleDeleteConfirm = async () => {
        if (!faqToDelete) return;
        try {
            await adminFaqApi.delete(faqToDelete.id);
            toast({
                title: "성공",
                description: "FAQ가 성공적으로 삭제되었습니다.",
            });
            fetchFaqs(); // 목록 새로고침
        } catch (error) {
            toast({
                title: "오류",
                description: "FAQ 삭제에 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsAlertOpen(false);
            setFaqToDelete(null);
        }
    };

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">FAQ 관리</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-rap">
              새 FAQ 등록
            </span>
                    </Button>
                </div>
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList>
                    {FAQ_CATEGORIES.map((category) => (
                        <TabsTrigger key={category.id} value={category.id}>
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>FAQ 목록</CardTitle>
                        <CardDescription>
                            자주 묻는 질문을 관리합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">카테고리</TableHead>
                                    <TableHead>질문</TableHead>
                                    <TableHead className="hidden md:table-cell">답변</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            로딩 중...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq) => (
                                        <TableRow key={faq.id}>
                                            <TableCell className="font-medium">{FAQ_CATEGORIES.find(c => c.id === faq.category?.toLowerCase())?.name || faq.category}</TableCell>
                                            <TableCell>{faq.question}</TableCell>
                                            <TableCell className="hidden md:table-cell truncate max-w-xs">{faq.answer}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(faq)}>수정</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(faq)}>삭제</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            해당 카테고리에 등록된 FAQ가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>

            {/* FAQ 등록/수정 다이얼로그 */}
            <FaqFormDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                faq={currentFaq}
                onSuccess={fetchFaqs}
            />

            {/* 삭제 확인 다이얼로그 */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다. 이 FAQ를 영구적으로 삭제합니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}

// FAQ 등록/수정 폼 컴포넌트
interface FaqFormDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    faq: Faq | null;
    onSuccess: () => void;
}

function FaqFormDialog({ isOpen, setIsOpen, faq, onSuccess }: FaqFormDialogProps) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (faq) {
            setQuestion(faq.question);
            setAnswer(faq.answer);
            setCategory(faq.category?.toLowerCase() || "");
        } else {
            // 새 FAQ 등록 시 폼 초기화
            setQuestion("");
            setAnswer("");
            setCategory("");
        }
    }, [faq, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) {
            toast({ title: "오류", description: "카테고리를 선택해주세요.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);

        const faqData: FaqCreateRequest = { question, answer, category: category };

        try {
            if (faq) {
                // 수정
                await adminFaqApi.update(faq.id, faqData);
                toast({ title: "성공", description: "FAQ가 수정되었습니다." });
            } else {
                // 생성
                await adminFaqApi.create(faqData);
                toast({ title: "성공", description: "새로운 FAQ가 등록되었습니다." });
            }
            onSuccess();
            setIsOpen(false);
        } catch (error) {
            toast({
                title: "오류",
                description: `FAQ ${faq ? '수정' : '등록'}에 실패했습니다.`,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{faq ? "FAQ 수정" : "새 FAQ 등록"}</DialogTitle>
                        <DialogDescription>
                            사용자들이 자주 묻는 질문과 답변을 입력해주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">카테고리</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="카테고리를 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FAQ_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="question" className="text-right">질문</Label>
                            <Input
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="answer" className="text-right">답변</Label>
                            <Textarea
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="col-span-3 min-h-[150px]"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>취소</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "저장 중..." : "저장"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}