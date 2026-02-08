"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  BookType,
  ListOrdered,
  LogOut,
  Menu,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-provider";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Classes",
    href: "/classes",
    icon: GraduationCap,
  },
  {
    name: "Subjects",
    href: "/subjects",
    icon: BookType,
  },
  {
    name: "Chapters",
    href: "/chapters",
    icon: BookOpen,
  },
  {
    name: "Topics",
    href: "/topics",
    icon: ListOrdered,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <>
      {/* Mobile Menu Button - moved to right side */}
      <button
        className="md:hidden fixed top-4 right-4 z-40 p-2 bg-background border rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            {/* <img
              src="/logo.png"
              alt="NEET Prep Logo"
              className="w-32 h-24 rounded-lg"
            /> */}
            <h2 className="text-2xl font-bold">Taiyari NEET ki</h2>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.includes(item.href) && item.name !== "Home");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn("h-5 w-5", isActive && "text-primary")}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 mt-auto border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
