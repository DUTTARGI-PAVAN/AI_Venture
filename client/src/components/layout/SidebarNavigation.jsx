import { BarChart3, LayoutDashboard, MessagesSquare } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Boardroom",
    to: "/boardroom",
    icon: MessagesSquare,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: BarChart3,
  },
];

export default function SidebarNavigation() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">AV</div>
        <div>
          <strong>AI Venture</strong>
          <span>Studio</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
              }
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
