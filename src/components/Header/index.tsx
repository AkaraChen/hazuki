import { useState } from 'react'
import { Menu, Home, Github, X } from 'lucide-react'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

function MenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Home
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 text-lg text-foreground hover:bg-muted/50 rounded-lg transition-colors"
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </a>
  )
}

function DrawerMenu() {
  const [open, setOpen] = useState(false)

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
          <div className="flex items-center justify-between px-4 mb-6">
            <span className="text-lg font-semibold">菜单</span>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent active:bg-transparent"
              >
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
          <div className="flex-1 space-y-2 px-2">
            <div onClick={() => setOpen(false)}>
              <MenuItem icon={Home} label="首页" href="/" />
            </div>
            <div onClick={() => setOpen(false)}>
              <MenuItem icon={Github} label="GitHub" href="https://github.com/AkaraChen/hazuki" />
            </div>
            <div onClick={() => setOpen(false)}>
              <MenuItem icon={X} label="Twitter" href="https://x.com/tanda_hazuki" />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3 flex-1">
        <DrawerMenu />
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
          反田叶月
        </h1>
        <span className="text-sm text-text-secondary bg-border/50 px-2 py-1 rounded-full">
          collection
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <a
          href="https://github.com/AkaraChen/hazuki"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-text-secondary hover:text-text transition-colors duration-200 group"
        >
          <Github className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>
        <a
          href="https://x.com/tanda_hazuki"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-text-secondary hover:text-text transition-colors duration-200 group"
        >
          <X className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </header>
  )
}
