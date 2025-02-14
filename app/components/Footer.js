import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-violet-900/50 backdrop-blur-md py-6 mt-16 border-t border-violet-800 z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-violet-200 text-sm">
          &copy; {new Date().getFullYear()} Learnfinity. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <Link href="/about" className="text-violet-200 hover:text-violet-300 transition">
            About Us
          </Link>
          <Link href="/contact" className="text-violet-200 hover:text-violet-300 transition">
            Contact
          </Link>
          <Link href="/privacy" className="text-violet-200 hover:text-violet-300 transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-violet-200 hover:text-violet-300 transition">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}