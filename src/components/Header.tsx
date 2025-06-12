import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  return (
    <header className="bg-orange-500 text-white p-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">JobTrail</h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
