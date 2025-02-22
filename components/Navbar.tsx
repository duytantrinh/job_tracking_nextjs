import React from "react"
import LinksDropdown from "./LinksDropdown"
import {UserButton} from "@clerk/nextjs"
import ThemeToggle from "./ThemeToggle"

function Navbar() {
  return (
    <nav className="bg-muted py-4 sm:px-16 lg:px-24 px-4 flex items-center justify-between">
      <div>
        {/* menu button for small screen */}
        <LinksDropdown />
      </div>

      <nav className="flex items-center gap-x-4">
        <ThemeToggle />

        <UserButton afterSignOutUrl="/" />
      </nav>
    </nav>
  )
}

export default Navbar
