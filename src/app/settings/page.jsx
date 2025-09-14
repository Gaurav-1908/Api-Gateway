import Sidebar from "../../components/Sidebar";
import Settings from "../../components/Settings";

export default function SettingsPage() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <Settings />
      </main>
    </>
  );
}
