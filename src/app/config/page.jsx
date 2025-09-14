import Sidebar from "../../components/Sidebar";
import Config from "../../components/Config";

export default function ConfigPage() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <Config />
      </main>
    </>
  );
}
