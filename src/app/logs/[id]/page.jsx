import LogById from "../../../components/LogById";
import Sidebar from "../../../components/Sidebar"

export default function LogPage() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <LogById/>
      </main>
    </>
  );
}
