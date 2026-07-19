import Breadcrumb from "../components/Breadcrumb";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import StatCards from "../components/StatCards";
import Activity from "../components/Activity";
import Performance from "../components/Performance";
import Action from "../components/Action";

function Dashboard() {
  return (
    <div className="px-4 py-8 flex flex-col gap-4">
      <Breadcrumb />
      <BreadcrumbHeader
        title="Welcome Back, Admin"
        par="Here's a snapshot of your content performance today."
        condition={true}
      />

      <StatCards />

      <div className="flex flex-col lg:flex-row w-full items-start gap-5">
        <div className="w-full lg:w-2/3 min-w-0">
          <Activity />
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-4 shrink-0">
          <Performance />
          <Action />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
