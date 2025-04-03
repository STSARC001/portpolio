// Camera settings
export const CAMERA_SETTINGS = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  INITIAL_POSITION: [0, 3, 10],
  TRANSITION_DURATION: 1.5
};

// Movement settings
export const MOVEMENT = {
  WALK_SPEED: 0.15,
  RUN_SPEED: 0.3,
  JUMP_FORCE: 0.5,
  GRAVITY: 0.02,
  INTERACTION_RADIUS: 3
};

// Environment settings
export const ENVIRONMENT = {
  AMBIENT_LIGHT_INTENSITY: 0.4,
  DIRECTIONAL_LIGHT_INTENSITY: 1.0,
  SHADOW_MAP_SIZE: 2048,
  FOG_COLOR: "#050505",
  FOG_NEAR: 10,
  FOG_FAR: 50
};

// Portfolio sections
export const SECTIONS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "about", label: "About", icon: "👨‍💻" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "skills", label: "Skills", icon: "🧠" },
  { id: "contact", label: "Contact", icon: "📧" }
];

// Developer-themed objects
export const DEV_OBJECTS = {
  LAPTOP: {
    position: [-5, 1, -7],
    scale: [1, 1, 1],
    title: "Frontend Development",
    description: "Building responsive UIs with modern frameworks"
  },
  SERVER: {
    position: [5, 1, -7],
    scale: [1, 1, 1],
    title: "Backend Development",
    description: "Creating robust server-side applications"
  },
  CODE_BLOCK: {
    position: [0, 1, -10],
    scale: [1, 1, 1],
    title: "Full Stack Development",
    description: "End-to-end development expertise"
  }
};

// Sample projects for showcase
export const PROJECTS = [
  {
    id: "project1",
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with user authentication, product search, cart management, and payment processing.",
    technologies: ["React", "Node.js", "MongoDB"],
    image: "/textures/asphalt.png"
  },
  {
    id: "project2",
    title: "Portfolio Dashboard",
    description: "Interactive dashboard for financial portfolio analysis with data visualization and real-time updates.",
    technologies: ["D3.js", "React", "Firebase"],
    image: "/textures/wood.jpg"
  },
  {
    id: "project3",
    title: "Mobile Weather App",
    description: "Weather forecast application with location-based services and 7-day forecasts.",
    technologies: ["React Native", "OpenWeather API"],
    image: "/textures/sky.png"
  }
];

// Skills categorization
export const SKILLS = [
  {
    category: "Frontend",
    items: ["React", "Vue.js", "Angular", "CSS/SASS", "TypeScript"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB"]
  },
  {
    category: "DevOps",
    items: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure"]
  },
  {
    category: "Other",
    items: ["Git", "Agile", "TDD", "UI/UX Design", "Performance Optimization"]
  }
];

// Contact methods
export const CONTACT_METHODS = [
  { 
    id: "email", 
    label: "Email", 
    icon: "✉️", 
    value: "contact@example.com" 
  },
  { 
    id: "github", 
    label: "GitHub", 
    icon: "🐙", 
    value: "github.com/username" 
  },
  { 
    id: "linkedin", 
    label: "LinkedIn", 
    icon: "🔗", 
    value: "linkedin.com/in/username" 
  },
  { 
    id: "twitter", 
    label: "Twitter", 
    icon: "🐦", 
    value: "twitter.com/username" 
  }
];
