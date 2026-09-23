// Single source of truth for CV content shown on the site.
// Keep this in sync with the CV document when either changes.

export const profile = {
  name: 'Mehmet Faruk Gül',
  title: 'Software Engineer / Computer Engineer',
  location: 'İstanbul, Türkiye',
  summary:
    'Software Engineer with a degree in Computer Engineering, building backend systems with Java and Python across 6–7 enterprise projects at Huawei. Experienced in taking task requirements, creating system designs, writing implementation code and running test procedures. Passionate about exploring new technologies and building personal side projects.',
  // Public version of the CV, placed in public/cv/ (leave empty to hide the button)
  cvUrl: '', // e.g. '/cv/Mehmet_Faruk_Gul_CV.pdf' after adding the file to public/cv/
};

export const contact = {
  emails: ['m.farukgul@gmail.com', 'mfg@engineer.com'],
  linkedin: 'https://linkedin.com/in/mfg/',
  github: ['https://github.com/mifarosa', 'https://github.com/Mastechnology'],
  blog: 'https://mfgstudiosblog.com',
  newsletter: 'https://www.linkedin.com/newsletters/patch-incoming-7343972064271175681/',
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  type: string;
  points: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    company: 'Huawei',
    role: 'Software Engineer',
    period: 'May 2022 – Present',
    type: 'Full-time',
    points: [
      'Work across 6–7 enterprise projects using Java, Python and SQL.',
      'Analyze incoming task requirements and prepare functional technical designs.',
      'Implement backend logic and APIs based on approved system designs.',
      'Run test processes with Playwright for web components and AirTest for mobile.',
      'Manage database queries and data structures with PostgreSQL and MyBatis.',
      'Take part in code reviews, unit testing with JUnit and Agile sprint workflows.',
    ],
    tags: ['Java', 'Python', 'SQL', 'PostgreSQL', 'MyBatis', 'Playwright', 'AirTest', 'JUnit', 'Git'],
  },
  {
    company: 'Ne-Ka Elektronik',
    role: 'Full-Stack Developer',
    period: 'Feb 2021 – May 2022',
    type: 'Full-time',
    points: ['Built desktop applications with PyQt5 and Flask, integrating ROS modules.'],
    tags: ['Python', 'PyQt5', 'Flask', 'ROS'],
  },
  {
    company: 'Mythology Tech Software R&D',
    role: 'Computer Engineering Intern',
    period: 'Aug 2020 – Oct 2020',
    type: 'Internship',
    points: ['Created data transmission pipelines using MQTT and RabbitMQ.'],
    tags: ['MQTT', 'RabbitMQ'],
  },
  {
    company: 'Gurme Soft',
    role: 'Web Developer',
    period: 'Sep 2019 – Jun 2020',
    type: 'Part-time',
    points: ['Developed custom WordPress invoicing plugins and wrote user documentation.'],
    tags: ['WordPress', 'PHP'],
  },
  {
    company: 'Orakçı Group of Companies',
    role: 'Computer Engineering Intern',
    period: 'Aug 2019 – Sep 2019',
    type: 'Internship',
    points: ['Wrote automated birthday notification scripts in Python.'],
    tags: ['Python', 'Automation'],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages & databases', items: ['Java', 'Python', 'SQL (PostgreSQL)', 'JavaScript', 'C / C++ / C# (basic)'] },
  { group: 'Frameworks & tools', items: ['Django', 'FastAPI', 'Flask', 'Playwright', 'AirTest', 'MyBatis', 'JUnit', 'Git', 'Postman'] },
  { group: 'Messaging & DevOps', items: ['RabbitMQ', 'MQTT', 'Docker', 'Linux (Debian, Ubuntu, Raspberry Pi OS)'] },
  { group: 'Currently learning', items: ['Spring Boot', 'Elasticsearch', 'Apache Kafka'] },
];

export const certifications = ['Prompt Engineering, BTK Akademi'];

export const education = [
  {
    school: 'Bursa Uludağ University',
    degree: 'B.Sc. in Computer Engineering',
    period: '2017 – 2021',
    detail:
      'GPA 3.31 / 4.00. Graduation project: an image classification application that tells recyclable materials apart.',
  },
  {
    school: 'Anadolu University',
    degree: 'Associate Degree in Business Management',
    period: '2020 – 2022',
    detail: 'Completed alongside the engineering degree.',
  },
];

export const leadership = [
  {
    org: 'IEEE BUU Student Branch',
    role: 'Computer Society Committee Representative',
    period: '2019 – 2020',
    detail: 'Organized coding workshops, training sessions and technical trips.',
  },
  {
    org: 'MERGEN Robotaxi & IEEE BUU autonomous car teams',
    role: 'Team member',
    period: '2018 – 2021',
    detail: 'Worked on object detection, parking algorithms and ROS for Teknofest and MARC autonomous vehicle competitions.',
  },
  {
    org: 'IEEE BUU Student Branch',
    role: 'Press & Media Representative',
    period: '2017 – 2019',
    detail: 'Designed social media posters and the branch magazine BULUŞ.',
  },
];
