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
  { id: "experience", label: "Experience", icon: "⏱️" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "gallery", label: "3D Gallery", icon: "🖼️" },
  { id: "blog", label: "Blog", icon: "📝" },
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

// Experience timeline
export const EXPERIENCE = [
  {
    id: "exp1",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    duration: "2021 - Present",
    description: "Leading the frontend team in developing modern web applications using React, TypeScript, and GraphQL.",
    technologies: ["React", "TypeScript", "GraphQL", "Next.js"],
    color: "#4a6baf"
  },
  {
    id: "exp2",
    title: "Full Stack Developer",
    company: "Digital Solutions LLC",
    duration: "2018 - 2021",
    description: "Built responsive web applications and RESTful APIs for clients across various industries.",
    technologies: ["Vue.js", "Node.js", "MongoDB", "Docker"],
    color: "#56a980"
  },
  {
    id: "exp3",
    title: "Junior Developer",
    company: "WebCraft Studios",
    duration: "2016 - 2018",
    description: "Developed and maintained websites for small to medium businesses, focusing on UI/UX best practices.",
    technologies: ["JavaScript", "PHP", "MySQL", "HTML/CSS"],
    color: "#a94e66"
  }
];

// Education timeline
export const EDUCATION = [
  {
    id: "edu1",
    degree: "Master of Computer Science",
    institution: "Tech University",
    duration: "2014 - 2016",
    description: "Specialized in software engineering and web technologies.",
    achievements: ["Graduated with honors", "Thesis on scalable web architectures"],
    color: "#5d4a9e"
  },
  {
    id: "edu2",
    degree: "Bachelor of Science in Computer Science",
    institution: "State University",
    duration: "2010 - 2014",
    description: "Foundational studies in programming, data structures, and algorithms.",
    achievements: ["Dean's List", "Student Developer Club President"],
    color: "#8e6a30"
  },
  {
    id: "edu3",
    degree: "Web Development Bootcamp",
    institution: "Coding Academy",
    duration: "2014",
    description: "Intensive training in modern web development practices and frameworks.",
    achievements: ["Final project recognized as Best UI/UX"],
    color: "#37877a"
  }
];

// 3D Gallery items
export const GALLERY_ITEMS = [
  {
    id: "gallery1",
    title: "Interactive Data Visualization",
    description: "A 3D visualization of complex data sets using Three.js and D3.",
    preview: "/textures/asphalt.png",
    position: [-12, 1, -15],
    rotation: [0, Math.PI / 4, 0]
  },
  {
    id: "gallery2",
    title: "WebGL Particle System",
    description: "Real-time particle effects created with WebGL and custom shaders.",
    preview: "/textures/wood.jpg",
    position: [0, 1, -20],
    rotation: [0, 0, 0]
  },
  {
    id: "gallery3",
    title: "3D Product Configurator",
    description: "Interactive 3D product visualization with customizable features.",
    preview: "/textures/sky.png",
    position: [12, 1, -15],
    rotation: [0, -Math.PI / 4, 0]
  }
];

// Blog posts
export const BLOG_POSTS = [
  {
    id: "post1",
    title: "Building Immersive Web Experiences with Three.js",
    date: "May 15, 2023",
    excerpt: "How to create immersive 3D websites that engage users and stand out from traditional designs.",
    category: "3D Web",
    color: "#4c6ef5"
  },
  {
    id: "post2",
    title: "Optimizing Performance in React Applications",
    date: "April 3, 2023",
    excerpt: "Practical techniques to improve the performance of your React applications.",
    category: "React",
    color: "#40c057"
  },
  {
    id: "post3",
    title: "The Future of Web Development: WebGPU and Beyond",
    date: "March 12, 2023",
    excerpt: "Exploring upcoming web technologies that will revolutionize web development.",
    category: "Future Tech",
    color: "#be4bdb"
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
