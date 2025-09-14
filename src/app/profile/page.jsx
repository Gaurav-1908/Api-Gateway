import Sidebar from "../../components/Sidebar";

export default function ProfilePage() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
        <p className="mt-2 text-slate-600">Profile details go here...</p>
      </main>
    </>
  );
}
