import React, { useState } from "react";
import { Link } from "./Link";
import NotificationsBell from "./NotificationsBell";
import type { User } from "../types/api";
import {
  MdLeaderboard,
  MdTableRestaurant,
  MdPerson,
  MdComputer,
  MdPeople,
  MdSettings,
  MdLogout,
  MdLogin,
  MdBarChart,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

function NavItem({ href, icon, label, isCollapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`btn btn-ghost w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} overflow-hidden`}
    >
      <span className={`${isCollapsed ? "" : "mr-2"} flex-shrink-0`}>
        {icon}
      </span>
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              delay: 0.1, // Delay text appearance until drawer is wider
            }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export function Layout({ children, user }: LayoutProps) {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isAuthenticated = !!user;

  const handleLogout = () => {
    // This will be handled by a form submission to trigger server-side logout
    window.location.href = "/logout";
  };

  return (
    <div className="flex h-screen bg-base-100">
      <Sidebar
        isHovered={isSidebarHovered}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <div className="flex flex-col h-full">
          <div
            className={`p-4 border-b border-base-300 ${!isSidebarHovered ? "px-3" : ""} overflow-hidden`}
          >
            <AnimatePresence mode="wait">
              {!isSidebarHovered ? (
                <motion.h1
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-bold text-primary text-center text-sm"
                >
                  🤏
                </motion.h1>
              ) : (
                <motion.h1
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  className="font-bold text-primary text-xl whitespace-nowrap"
                >
                  🤏🐢🏠
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          <nav
            className={`flex-1 space-y-2 ${!isSidebarHovered ? "p-2" : "p-4"}`}
          >
            <NavItem
              href="/"
              icon={<MdTableRestaurant className="w-5 h-5" />}
              label="Join a Game"
              isCollapsed={!isSidebarHovered}
            />

            {isAuthenticated && (
              <>
                <NavItem
                  href="/queue"
                  icon={<MdLeaderboard className="w-5 h-5" />}
                  label="Queue"
                  isCollapsed={!isSidebarHovered}
                />

                <NavItem
                  href="/profile"
                  icon={<MdPerson className="w-5 h-5" />}
                  label="Profile"
                  isCollapsed={!isSidebarHovered}
                />

                <NavItem
                  href="/bots"
                  icon={<MdComputer className="w-5 h-5" />}
                  label="My Bots"
                  isCollapsed={!isSidebarHovered}
                />

                <NavItem
                  href="/friends"
                  icon={<MdPeople className="w-5 h-5" />}
                  label="Friends"
                  isCollapsed={!isSidebarHovered}
                />
              </>
            )}

            <NavItem
              href="/leaderboards"
              icon={<MdBarChart className="w-5 h-5" />}
              label="Leaderboards"
              isCollapsed={!isSidebarHovered}
            />

            {user?.role === "admin" && (
              <NavItem
                href="/admin"
                icon={<MdSettings className="w-5 h-5" />}
                label="Admin"
                isCollapsed={!isSidebarHovered}
              />
            )}
          </nav>

          <div
            className={`border-t border-base-300 ${!isSidebarHovered ? "p-2" : "p-4"}`}
          >
            {isAuthenticated ? (
              <div className="space-y-2">
                <div
                  className={`flex items-center ${!isSidebarHovered ? "justify-center" : "justify-between"}`}
                >
                  <AnimatePresence mode="wait">
                    {isSidebarHovered && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {user?.username}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <NotificationsBell user={user} />
                </div>
                <button
                  onClick={handleLogout}
                  className={`btn btn-ghost btn-sm w-full ${!isSidebarHovered ? "px-0" : ""}`}
                  title="Logout"
                >
                  <MdLogout className="w-5 h-5" />
                  <AnimatePresence mode="wait">
                    {isSidebarHovered && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="ml-2 whitespace-nowrap"
                      >
                        Logout
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`btn btn-primary btn-sm w-full ${!isSidebarHovered ? "px-0" : ""}`}
              >
                <MdLogin className="w-5 h-5" />
                <AnimatePresence mode="wait">
                  {isSidebarHovered && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="ml-2 whitespace-nowrap"
                    >
                      Login
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}
          </div>
        </div>
      </Sidebar>

      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  children,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <>
      {/* Spacer div to maintain layout when sidebar is collapsed */}
      <div
        className="flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{ width: 64 }}
      />

      {/* Actual sidebar that overlays when expanded */}
      <motion.aside
        className="bg-base-200 fixed left-0 top-0 h-full z-50 shadow-xl overflow-x-hidden"
        animate={{
          width: isHovered ? 256 : 64,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </motion.aside>

      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onMouseLeave}
          />
        )}
      </AnimatePresence>
    </>
  );
}
