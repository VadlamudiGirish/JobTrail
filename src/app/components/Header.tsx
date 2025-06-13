"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const locale = pathname.split("/")[1] || "en";

  const navigation = [
    { name: "Home", href: `/${locale}` },
    { name: "Applications", href: `/${locale}/applications` },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex items-center gap-x-12">
          <div className="-m-1.5 p-1.5">
            <span className="sr-only">JobTrail</span>
            <Image
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="JobTrail Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
          </div>

          {session?.user && (
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold ${
                    isActive(item.href)
                      ? "text-orange-600 underline underline-offset-4"
                      : "text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-x-6">
          <LanguageSwitcher />
          {session?.user && (
            <>
              <span className="text-sm font-medium text-gray-700">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm font-semibold text-orange-600 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className="-m-1.5 p-1.5">
              <Image
                src="/jobtrail-logo.png"
                alt="JobTrail Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          {session?.user && (
            <div className="mt-6">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <span className="block text-sm mb-2 text-gray-700">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-semibold text-orange-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </header>
  );
}
