import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="w-full fixed top-2 max-w-6xl flex justify-between items-center p-4 z-10">
      <h1 className="text-2xl font-bold text-white"><Link href={"/"}>Learnfinity</Link></h1>
      <div className="flex space-x-6">
        <Link href="/ai-chat" className="text-white hover:text-violet-300 transition">
          AI Chat
        </Link>
        <Link href="/google-login" className="text-white hover:text-violet-300 transition">
          Google Login
        </Link>
      </div>
    </div>
  );
}