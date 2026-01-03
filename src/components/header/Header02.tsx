import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ModeToggle from "../theme/mode-toggle";

const TopMenu = [
  { id: "pdv", name: "PDV", href: "/pdv" },
  { id: "pricing", name: "Pricing", href: "#pricing" },
  { id: "faq", name: "FAQ", href: "#faq" },
];

const Logo = () => {
  return (
    <Link href="/" className="flex space-x-2 py-3 items-center">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="StarterKitPro Blocks"
          width={24}
          height={24}
        />
        PROCEDURES
      </h1>
    </Link>
  );
};

export default function Header02() {
  return (
    <header className="sticky top-5 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="border rounded-md w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1 px-4">
          <nav className="hidden justify-between md:flex">
            <div className="flex items-center gap-6">
              <Logo />
            </div>
            <div className="items-center flex gap-6">
              <div className="flex items-center">
                {TopMenu.map((menu) => (
                  <a
                    key={menu.id}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      navigationMenuTriggerStyle,
                    )}
                    href={menu.href}
                  >
                    {menu.name}
                  </a>
                ))}
              </div>
              <Suspense>
                <ModeToggle />
              </Suspense>
              <div className="flex gap-2">
                <Link
                  href="/test-procedure"
                  className={buttonVariants({ variant: "default" })}
                >
                  Test Procedures
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between">
              <Logo />

              <Sheet>
                <div className="flex gap-3 items-center">
                  <Suspense>
                    <ModeToggle />
                  </Suspense>
                  <SheetTrigger asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <Menu className="size-4" />
                    </Button>
                  </SheetTrigger>
                </div>
                <SheetContent
                  side="bottom"
                  className="overflow-y-auto pt-0 pb-5"
                >
                  <SheetHeader className="pb-0">
                    <SheetTitle>
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-0 flex flex-col gap-0 px-4">
                    {TopMenu.map((menu) => (
                      <a
                        key={menu.id}
                        href={menu.href}
                        className="font-semibold text-lg py-2"
                      >
                        {menu.name}
                      </a>
                    ))}
                  </div>
                  <div className="border-t pt-4 px-4">
                    <div className="mt-2 flex flex-col gap-2">
                      <Link
                        href="/login"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "py-5",
                        )}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
