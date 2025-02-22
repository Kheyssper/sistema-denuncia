import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Eye, BookOpen, HelpCircle, FolderTree } from 'lucide-react';

const menuItems = [
  { path: "/", label: "Painel", icon: LayoutDashboard },
  { path: "/denuncia", label: "Nova Denúncia", icon: FileText },
  { path: "/acompanhar", label: "Acompanhar", icon: Eye },
  { path: "/conscientizacao", label: "Conscientização", icon: BookOpen },
  { path: "/perguntas", label: "Perguntas", icon: HelpCircle },
  { path: "/categorias", label: "Categorias", icon: FolderTree }
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-screen fixed">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">+ AMOR</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg p-3 mb-1"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;