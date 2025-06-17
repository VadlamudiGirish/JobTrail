"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/en");
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-6 sm:p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Image
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="ApplicationTrail"
            width={48}
            height={48}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to ApplicationTrail
          </h1>
          <p className="text-sm text-gray-600">Please sign in to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
          >
            <GoogleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Sign in with Google</span>
          </button>

          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-3 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
          >
            <GitHubIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Sign in with GitHub</span>
          </button>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 488 512" fill="currentColor" {...props}>
      <path
        fill="#EA4335"
        d="M488 261.8c0-17.7-1.6-35-4.6-51.8H249v98h135.6c-5.9 31.8-23.3 58.9-49.8 77l80.6 62c47-43.4 74.6-107.4 74.6-185.2z"
      />
      <path
        fill="#34A853"
        d="M249 480c66 0 121.5-21.9 162-59.4l-80.6-62c-22.4 15-51.2 23.8-81.4 23.8-62.7 0-115.8-42.4-134.8-99.6H30.5v62.6C72.4 430.9 154.6 480 249 480z"
      />
      <path
        fill="#4A90E2"
        d="M114.2 282.8c-4.8-14.3-7.6-29.6-7.6-45.2s2.7-30.9 7.6-45.2V130H30.5C10.9 170.4 0 212.4 0 256s10.9 85.6 30.5 126l83.7-99.2z"
      />
      <path
        fill="#FBBC05"
        d="M249 102.4c35.9 0 68 12.4 93.4 36.8l70.2-70.2C370.4 24.8 313.8 0 249 0 154.6 0 72.4 49.1 30.5 130l83.7 99.2c19-57.2 72.1-99.6 134.8-99.6z"
      />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.49 2 12.02c0 4.42 2.87 8.18 6.84 9.5.5.09.68-.22.68-.48
        0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61
        1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95
        0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 012.5-.34c.85.01 1.7.11 2.5.34
        1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.91.68 1.85
        0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0022 12.02C22 6.49 17.52 2 12 2z"
      />
    </svg>
  );
}
