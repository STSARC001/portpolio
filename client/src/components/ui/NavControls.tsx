import { cn } from "@/lib/utils";

interface NavControlsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onToggleControls: () => void;
}

const sections = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "about", label: "About", icon: "👨‍💻" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "skills", label: "Skills", icon: "🧠" },
  { id: "contact", label: "Contact", icon: "📧" },
];

export default function NavControls({ 
  activeSection, 
  onSectionChange,
  onToggleControls
}: NavControlsProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/60 backdrop-blur-md rounded-full py-2 px-4 shadow-lg">
      <div className="flex items-center space-x-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "px-4 py-2 rounded-full transition-colors duration-200",
              activeSection === section.id 
                ? "bg-cyan-500 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
          >
            <span className="hidden md:inline">{section.label}</span>
            <span className="md:hidden">{section.icon}</span>
          </button>
        ))}
        
        <button
          onClick={onToggleControls}
          className="ml-2 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  );
}
