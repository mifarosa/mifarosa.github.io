// Single source of truth for CV content shown on the site.
// The data lives in profile.json so it can be edited from the admin panel (/admin/cms);
// this module only adds types. Keep it in sync with the CV document when either changes.
import data from './profile.json';

export type Profile = {
  name: string;
  title: string;
  location: string;
  headline: string;   // large opening sentence at the top of the home page
  summary: string;
  cvUrl: string;      // public CV under public/cv/, e.g. '/cv/Mehmet_Faruk_Gul_CV.pdf'; empty hides the button
};

export type Contact = {
  emails: string[];
  linkedin: string;
  github: string[];
  blog: string;
  newsletter: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  type: string;
  points: string[];
  tags: string[];
};

export type Education = { school: string; degree: string; period: string; detail: string };
export type Leadership = { org: string; role: string; period: string; detail: string };

export const profile: Profile = data.profile;
export const contact: Contact = data.contact;
export const experience: Experience[] = data.experience;
export const skills: { group: string; items: string[] }[] = data.skills;
export const certifications: string[] = data.certifications;
export const education: Education[] = data.education;
export const leadership: Leadership[] = data.leadership;
