import Sidebar from "../../components/Sidebar";
import LogViewer from "../../components/LogViewer";

export default function LogsPage() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <LogViewer />
      </main>
    </>
  );
}
