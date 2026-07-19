import Breadcrumb from "../components/Breadcrumb";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import StatCards from "../components/StatCards";
import ArticlesSection from "../components/ArticlesSection";

function AllArticles() {
  return (
    <div className="px-4 py-8 flex flex-col gap-4">
      <Breadcrumb />
      <BreadcrumbHeader
        title={"Articles"}
        par={"Manage and publish your corporate editorial content."}
        condition={true}
      />
      <StatCards />
      <ArticlesSection />
    </div>
  );
}

export default AllArticles;
