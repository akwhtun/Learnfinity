export default function ForbiddenPage() {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600">403</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Access Denied
          </h2>
          <p className="mt-2 text-gray-500">
            You don’t have permission to access this page.
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-3 text-white hover:bg-violet-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
  