import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createPortal } from "react-dom";
import Breadcrumb from "../components/Breadcrumb";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import ArticleForm from "../components/ArticleForm";
import ImageUploader from "../components/ImageUploader";
import PublishSetting from "../components/PublishSetting";
import Toast from "../components/Toast";

import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { compressAndConvertToBase64 } from "../utils/imageCompression";

function AddArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    slug: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleFinalSubmit = async (formTextData) => {
    setLoading(true);
    try {
      let imageUrl = "https://placehold.co/600x400/e2e8f0/475569?text=No+Image";
      if (selectedImageFile) {
        imageUrl = await compressAndConvertToBase64(selectedImageFile);
      }

      const finalArticlePayload = {
        title: formTextData.title || "",
        content: formTextData.content || "",
        category: formTextData.category || "Finance",
        readTime: formTextData.readTime || "5 min read",
        author: user?.displayName || user?.email?.split("@")[0] || "Admin",
        tags: tags,
        isFeatured: featured,
        image: imageUrl,
        status: formTextData.status || "draft",
        seo: seoData,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "articles"), finalArticlePayload);
      setToast({ message: "Article published successfully!", type: "success" });
      setTimeout(() => navigate("/articles"), 1500);
    } catch (error) {
      console.error(error);
      setToast({
        message: error.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 flex flex-col gap-4 relative">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {loading &&
        createPortal(
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9990] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-scale-in">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-600">
                Publishing article...
              </p>
            </div>
          </div>,
          document.body,
        )}

      <Breadcrumb />
      <BreadcrumbHeader
        title="Create New Article"
        par="Draft high-quality content for your enterprise audience."
      />
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 justify-around">
        <div className="flex-1 w-full min-w-0">
          <ArticleForm onPublish={handleFinalSubmit} loading={loading} />
        </div>
        <div className="flex flex-col gap-6 w-full xl:w-1/3 shrink-0">
          <ImageUploader onImageSelect={setSelectedImageFile} />
          <PublishSetting
            tags={tags}
            setTags={setTags}
            featured={featured}
            setFeatured={setFeatured}
            seoData={seoData}
            setSeoData={setSeoData}
          />
        </div>
      </div>
    </div>
  );
}

export default AddArticle;
