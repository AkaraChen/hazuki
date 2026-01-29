import { useState } from "react";
import { Menu, Home } from "lucide-react";
import { siGithub, siX } from "simple-icons/icons";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

function Icon({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="currentColor">
      <path d={path} />
    </svg>
  );
}

function MenuItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 py-3 text-lg text-foreground hover:bg-muted/50 rounded-lg transition-colors"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function DrawerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden hover:bg-transparent active:bg-transparent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">菜单</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-70 mr-auto border-r">
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center justify-between px-4 mb-2">
            <span className="text-lg font-semibold">菜单</span>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent active:bg-transparent"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Button>
            </DrawerClose>
          </div>
          <div className="flex-1 space-y-2 px-4">
            <div onClick={() => setOpen(false)}>
              <MenuItem icon={<Home className="w-5 h-5" />} label="首页" href="/" />
            </div>
            <div onClick={() => setOpen(false)}>
              <MenuItem
                icon={<Icon path={siGithub.path} />}
                label="GitHub"
                href="https://github.com/AkaraChen/hazuki"
              />
            </div>
            <div onClick={() => setOpen(false)}>
              <MenuItem
                icon={<Icon path={siX.path} />}
                label="Twitter"
                href="https://x.com/tanda_hazuki"
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 sm:static max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 sm:bg-transparent bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 flex-1">
        <DrawerMenu />
        <h1 className="text-lg sm:text-xl font-medium text-text tracking-tight">反田叶月</h1>
        <span className="text-sm text-text-secondary bg-border/50 px-2 py-1 rounded-full">
          collection
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <a
          href="https://github.com/AkaraChen/hazuki"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 no-underline text-text-secondary hover:text-text transition-colors duration-200 group"
        >
          <Icon
            path={siGithub.path}
            className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-sm">Star on GitHub</span>
        </a>
        <a
          href="https://x.com/tanda_hazuki"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 no-underline text-text-secondary hover:text-text transition-colors duration-200 group"
        >
          <Icon
            path={siX.path}
            className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-sm">Follow on X</span>
        </a>
      </div>
    </header>
  );
}
