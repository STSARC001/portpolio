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
    title: "AI-Powered Tools",
    description: "Developed innovative AI-powered tools at ZyraTech that improved customer engagement by 40% and streamlined business processes.",
    technologies: ["AI/ML", "Web Development", "User Experience Design"],
    image: "/textures/asphalt.png"
  },
  {
    id: "project2",
    title: "Fintech Project Management",
    description: "Led fintech projects at Money Forward, reducing operational bottlenecks and improving project delivery speed by 20%.",
    technologies: ["Project Management", "Fintech", "Agile Methodologies"],
    image: "/textures/wood.jpg"
  },
  {
    id: "project3",
    title: "Career Empowerment Programs",
    description: "Launched comprehensive career assistance programs at ZyraTech, helping professionals advance their careers in tech.",
    technologies: ["Career Development", "Education", "Mentorship"],
    image: "/textures/sky.png"
  },
  {
    id: "project4",
    title: "Team Scaling Initiative",
    description: "Successfully scaled ZyraTech from startup to an 11+ member team in just 6 months, establishing effective organizational structures.",
    technologies: ["Team Building", "Leadership", "Business Development"],
    image: "/textures/wood.jpg"
  }
];

// Skills categorization
export const SKILLS = [
  {
    category: "Development & AI",
    items: ["Full Stack Development", "AI-Powered Solutions", "Machine Learning", "React.js", "Technical Project Leadership"]
  },
  {
    category: "Leadership",
    items: ["Strategic Vision", "Team Management", "Project Planning", "Resource Management", "Product Lifecycle Management"]
  },
  {
    category: "Technologies",
    items: ["AI/ML", "Web Development", "Fintech Solutions", "Project Management Tools", "Agile Methodologies"]
  },
  {
    category: "Other",
    items: ["Digital Marketing", "Analytics", "UI/UX Design", "Business Scaling", "Customer Experience Enhancement"]
  }
];

// Experience timeline
export const EXPERIENCE = [
  {
    id: "exp1",
    title: "CEO",
    company: "ZyraTech",
    duration: "September 2024 - Present",
    description: "Led the strategic vision and growth of ZyraTech, positioning it as a key player in the tech industry. Spearheaded the development and deployment of innovative web and AI solutions.",
    technologies: ["AI", "Web Development", "Team Leadership", "Product Management"],
    color: "#4a6baf"
  },
  {
    id: "exp2",
    title: "Project Manager Team Lead",
    company: "Money Forward",
    duration: "April 2024 - October 2024",
    description: "Led a cross-functional team of developers to deliver high-priority projects in the fintech sector. Boosted project delivery efficiency by 20% through optimized workflows.",
    technologies: ["Project Management", "Fintech", "Agile Methodologies"],
    color: "#56a980"
  },
  {
    id: "exp3",
    title: "Full-stack Developer",
    company: "FlyLab Solutions Private Limited",
    duration: "May 2023 - May 2024",
    description: "Developed full-stack solutions collaborating with cross-functional teams. Focused on iterative development and continuous improvement.",
    technologies: ["Full-stack Development", "Web Applications", "Collaborative Development"],
    color: "#a94e66"
  },
  {
    id: "exp4",
    title: "React.js Intern",
    company: "STSARC",
    duration: "May 2022 - May 2023",
    description: "Gained practical experience in React.js development at Sahajananda Tech Services And Research Center.",
    technologies: ["React.js", "Frontend Development", "Web Applications"],
    color: "#6a8cb3"
  }
];

// Education timeline
export const EDUCATION = [
  {
    id: "edu1",
    degree: "Bachelor of Engineering - BE, Computer Engineering",
    institution: "Sandip Institute of Technology, & Research Centre",
    duration: "May 2021 - July 2024",
    description: "Comprehensive computer engineering education with focus on software development and AI.",
    achievements: ["Software Engineer certification", "Introduction to Generative AI certification"],
    color: "#5d4a9e"
  },
  {
    id: "edu2",
    degree: "Machine Learning Certification",
    institution: "Online Learning Platform",
    duration: "2023",
    description: "In-depth study of machine learning algorithms and applications.",
    achievements: ["Machine Learning certification", "Practical ML implementations"],
    color: "#8e6a30"
  },
  {
    id: "edu3",
    degree: "Digital Marketing Certifications",
    institution: "Google",
    duration: "2022",
    description: "Specialized training in digital marketing and analytics.",
    achievements: ["Campaign Manager 360 Certification", "Google Analytics Certification"],
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
    title: "The Rise of AI in Business Applications",
    date: "March 20, 2024",
    excerpt: "How AI-powered tools are transforming business operations and customer engagement strategies in 2024.",
    category: "AI & Business",
    color: "#4c6ef5"
  },
  {
    id: "post2",
    title: "Scaling Your Tech Startup: Lessons from ZyraTech",
    date: "February 15, 2024",
    excerpt: "Key insights and strategies for growing your tech startup from zero to a productive team in under 6 months.",
    category: "Startup Growth",
    color: "#40c057"
  },
  {
    id: "post3",
    title: "The Intersection of Fintech and AI",
    date: "January 10, 2024",
    excerpt: "Exploring how artificial intelligence is revolutionizing financial technology and creating new opportunities.",
    category: "Fintech",
    color: "#be4bdb"
  },
  {
    id: "post4",
    title: "Career Advancement in the AI Era",
    date: "December 5, 2023",
    excerpt: "Navigating career growth in technology fields as AI continues to reshape job roles and skill requirements.",
    category: "Career Development",
    color: "#fa5252"
  }
];

// Contact methods
export const CONTACT_METHODS = [
  { 
    id: "email", 
    label: "Email", 
    icon: "✉️", 
    value: "abhijitdengale2003@gmail.com" 
  },
  { 
    id: "phone", 
    label: "Phone", 
    icon: "📱", 
    value: "9370162316" 
  },
  { 
    id: "linkedin", 
    label: "LinkedIn", 
    icon: "🔗", 
    value: "www.linkedin.com/in/abhijitdengale" 
  },
  { 
    id: "website", 
    label: "Website", 
    icon: "🌐", 
    value: "abhijit01.netlify.app" 
  }
];
