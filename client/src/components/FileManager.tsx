import { useState, useRef } from "react";
import React from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2, Download, Share2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

const CATEGORIES = [
  { value: "general", label: "ทั่วไป" },
  { value: "disability", label: "สิทธิประโยชน์ผู้พิการ" },
  { value: "tax", label: "สิทธิลดหย่อนภาษี" },
  { value: "resources", label: "ทรัพยากรและที่ดิน" },
  { value: "innovation", label: "นวัตกรรมเกษตร" },
  { value: "partnership", label: "ความร่วมมือทางธุรกิจ" },
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fileName: "",
    category: "general",
    description: "",
    isPublic: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // tRPC queries and mutations
  const { data: files, isLoading: isLoadingFiles, refetch: refetchFiles } = trpc.files.list.useQuery();
  const uploadMutation = trpc.files.upload.useMutation();
  const deleteMutation = trpc.files.delete.useMutation();
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);
  const [downloadFileIdForQuery, setDownloadFileIdForQuery] = useState<number | null>(null);
  const { data: downloadUrlData } = trpc.files.getDownloadUrl.useQuery(
    { fileId: downloadFileIdForQuery || 0 },
    { enabled: downloadFileIdForQuery !== null }
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`ไฟล์ใหญ่เกินไป (สูงสุด 50MB)`);
      return;
    }

    setSelectedFile(file);
    setFormData((prev) => ({
      ...prev,
      fileName: file.name,
    }));
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("กรุณาเลือกไฟล์");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(",")[1];

        try {
          await uploadMutation.mutateAsync({
            fileName: formData.fileName,
            fileData: base64Data,
            mimeType: selectedFile.type,
            fileSize: selectedFile.size,
            category: formData.category as any,
            description: formData.description,
            isPublic: formData.isPublic,
          });

          setUploadSuccess(true);
          setFormData({
            fileName: "",
            category: "general",
            description: "",
            isPublic: false,
          });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          // Refetch files list
          await refetchFiles();

          // Close dialog after 2 seconds
          setTimeout(() => {
            setIsOpen(false);
            setUploadSuccess(false);
          }, 2000);
        } catch (error) {
          setUploadError(
            error instanceof Error ? error.message : "การอัพโหลดล้มเหลว"
          );
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด"
      );
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm("คุณแน่ใจหรือว่าต้องการลบไฟล์นี้?")) return;

    try {
      await deleteMutation.mutateAsync({ fileId });
      await refetchFiles();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "ไม่สามารถลบไฟล์ได้"
      );
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      setDownloadingFileId(fileId);
      setDownloadFileIdForQuery(fileId);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "ไม่สามารถดาวน์โหลดไฟล์ได้"
      );
      setDownloadingFileId(null);
    }
  };

  // Handle download when URL is ready
  React.useEffect(() => {
    if (downloadUrlData && downloadingFileId) {
      const fileName = files?.find((f) => f.id === downloadingFileId)?.fileName || "file";
      const a = document.createElement("a");
      a.href = downloadUrlData.url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadingFileId(null);
      setDownloadFileIdForQuery(null);
    }
  }, [downloadUrlData, downloadingFileId, files]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Upload size={18} />
            อัพโหลดไฟล์
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>อัพโหลดไฟล์ใหม่</DialogTitle>
            <DialogDescription>
              เลือกไฟล์เอกสารเพื่ออัพโหลด (สูงสุด 50MB)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Input */}
            <div>
              <Label htmlFor="file-input">เลือกไฟล์</Label>
              <Input
                ref={fileInputRef}
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="mt-2"
              />
              {selectedFile && (
                <p className="text-sm text-gray-500 mt-2">
                  ไฟล์ที่เลือก: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            {/* File Name */}
            <div>
              <Label htmlFor="file-name">ชื่อไฟล์</Label>
              <Input
                id="file-name"
                value={formData.fileName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fileName: e.target.value,
                  }))
                }
                disabled={isUploading}
                className="mt-2"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">หมวดหมู่</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
                disabled={isUploading}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">คำอธิบาย (ไม่บังคับ)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={isUploading}
                placeholder="เพิ่มคำอธิบายเกี่ยวกับไฟล์นี้"
                className="mt-2 resize-none"
                rows={3}
              />
            </div>

            {/* Public Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-public"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublic: checked as boolean,
                  }))
                }
                disabled={isUploading}
              />
              <Label htmlFor="is-public" className="cursor-pointer">
                เปิดให้สาธารณชนเข้าถึงได้
              </Label>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>อัพโหลดไฟล์สำเร็จ!</span>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  กำลังอัพโหลด...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  อัพโหลด
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Files List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">ไฟล์ของฉัน</h2>

        {isLoadingFiles ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : !files || files.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <p>ยังไม่มีไฟล์</p>
            <p className="text-sm mt-2">เริ่มต้นด้วยการอัพโหลดไฟล์ใหม่</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.id} className="p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {file.fileName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {CATEGORIES.find((c) => c.value === file.category)?.label} • {formatFileSize(file.fileSize)}
                    </p>
                    {file.description && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      อัพโหลด {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true, locale: th })}
                    </p>
                    {file.isPublic === 1 && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        เปิดสาธารณะ
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file.id, file.fileName)}
                      disabled={downloadingFileId === file.id}
                      title="ดาวน์โหลด"
                    >
                      {downloadingFileId === file.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Download size={18} />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="แชร์"
                      disabled
                    >
                      <Share2 size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      title="ลบ"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
