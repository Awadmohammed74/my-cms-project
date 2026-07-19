import { useState, useMemo } from "react";

export function useTableControls(initialData = []) {
  const [statusFilter, setStatusFilter] = useState("all"); // all, published, draft, featured
  const [sortBy, setSortBy] = useState("latest");

  const processedData = useMemo(() => {
    return initialData
      .filter((item) => {
        // 1. فلتر الكل
        if (statusFilter === "all") return true;

        // 2. فلتر الـ Featured (الإضافة الجديدة)
        if (statusFilter === "featured") return item.isFeatured === true;

        // 3. فلتر الحالة (Published/Draft)
        const itemStatus = item.status?.toLowerCase();
        const isItemPublished =
          itemStatus === "published" || item.isVisible === true;
        const normalizedStatus = isItemPublished ? "published" : "draft";

        return normalizedStatus === statusFilter.toLowerCase();
      })
      .sort((a, b) => {
        // دالة مساعدة لاستخراج التاريخ
        const getDate = (item) => {
          if (item.createdAt && typeof item.createdAt?.toDate === "function") {
            return item.createdAt.toDate();
          }
          if (item.date) return new Date(item.date);
          return new Date(0);
        };

        if (sortBy === "latest") return getDate(b) - getDate(a);
        if (sortBy === "oldest") return getDate(a) - getDate(b);
        if (sortBy === "title")
          return (a.title || "").localeCompare(b.title || "");

        return 0;
      });
  }, [initialData, statusFilter, sortBy]);

  return {
    processedData,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  };
}
