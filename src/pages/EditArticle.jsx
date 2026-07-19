import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import ArticleForm from "../components/ArticleForm";
import ImageUploader from "../components/ImageUploader";
import PublishSetting from "../components/PublishSetting";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import { Trash2 } from "lucide-react";
import { compressAndConvertToBase64 } from "../utils/imageCompression";

function EditArticle() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Updating...");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [article, setArticle] = useState(null);
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    slug: "",
  });
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setArticle(data);
          setTags(data.tags || []);
          setFeatured(data.isFeatured || false);
          if (data.seo) {
            setSeoData({
              metaTitle: data.seo.metaTitle || "",
              metaDescription: data.seo.metaDescription || "",
              keywords: data.seo.keywords || "",
              canonicalUrl: data.seo.canonicalUrl || "",
              slug: data.seo.slug || "",
            });
          }
        } else {
          setToast({ message: "Article not found.", type: "error" });
        }
      } catch (error) {
        console.error("Fetch article error:", error);
        setToast({
          message: `Error loading article: ${error.message}`,
          type: "error",
        });
      }
    };
    fetchArticle();
  }, [id]);

  const handleFinalSubmit = async (updatedData) => {
    setLoadingText("Updating article...");
    setLoading(true);
    try {
      let finalImageUrl = article.image;
      if (selectedImageFile instanceof File) {
        finalImageUrl = await compressAndConvertToBase64(selectedImageFile);
      }
      await updateDoc(doc(db, "articles", id), {
        ...updatedData,
        image: finalImageUrl,
        tags,
        isFeatured: featured,
        seo: seoData,
        author: user?.displayName || user?.email?.split("@")[0] || "Admin",
      });
      setToast({ message: "Article updated successfully!", type: "success" });
      setTimeout(() => navigate("/articles"), 1500);
    } catch (error) {
      console.error("Update article error:", error);
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const executeDelete = async () => {
    setLoadingText("Deleting article...");
    setLoading(true);
    try {
      await deleteDoc(doc(db, "articles", id));
      setToast({ message: "Article deleted successfully!", type: "success" });
      setTimeout(() => navigate("/articles"), 1500);
    } catch (error) {
      console.error("Delete article error:", error);
      setToast({
        message: `Error deleting: ${error.code || error.message}`,
        type: "error",
      });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return (
      <div className="px-4 py-8">
        <div className="flex items-center justify-center py-24 bg-white border border-slate-200 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">
              Loading article...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 flex flex-col gap-4 relative">
      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          title="Delete Article"
          message="Are you sure you want to delete this article? This action cannot be undone."
          onConfirm={executeDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

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
            <div className="bg-white p-6 rounded-xl flex items-center gap-3 shadow-2xl">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-slate-700">{loadingText}</p>
            </div>
          </div>,
          document.body,
        )}

      <BreadcrumbHeader
        title="Edit Your Article"
        par="Manage and refine your corporate editorial content."
      />

      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start">
        <div className="flex-1 w-full min-w-0 flex flex-col">
          <ArticleForm
            onPublish={handleFinalSubmit}
            loading={loading}
            initialData={article}
          />

          <div className="mt-3 w-full">
            <button
              type="button"
              onClick={handleDeleteClick}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all cursor-pointer relative"
            >
              <Trash2 className="w-4 h-4" />
              Delete Article
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full xl:w-1/3 shrink-0">
          <ImageUploader
            onImageSelect={setSelectedImageFile}
            initialdata={article}
          />
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

export default EditArticle;
