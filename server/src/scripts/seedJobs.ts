import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Job } from '../models/job.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not defined.');
  process.exit(1);
}

const mockJobs = [
  {
    title: 'Frontend Developer (React / Next.js)',
    company: 'TechCorp Solutions',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: '0-2 yrs',
    salary: { min: 600000, max: 1000000, currency: 'INR', isDisclosed: true },
    description: 'We are looking for a passionate Frontend Developer skilled in React, Next.js, and TypeScript to build responsive web applications.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    sourceUrl: 'https://example.com/jobs/1',
    status: 'active',
  },
  {
    title: 'Full Stack Software Engineer',
    company: 'Innovate Labs',
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceLevel: '2-5 yrs',
    salary: { min: 1200000, max: 1800000, currency: 'INR', isDisclosed: true },
    description: 'Join our dynamic team to build scalable microservices with Node.js, Express, MongoDB, and modern frontend frameworks.',
    skills: ['Node.js', 'Express', 'MongoDB', 'React', 'TypeScript'],
    sourceUrl: 'https://example.com/jobs/2',
    status: 'active',
  },
  {
    title: 'Junior Backend Developer',
    company: 'DataFlow Systems',
    location: 'Hybrid (Delhi NCR)',
    jobType: 'Full-time',
    experienceLevel: 'Fresher',
    salary: { min: 450000, max: 700000, currency: 'INR', isDisclosed: true },
    description: 'Great opportunity for fresh graduates! Learn REST API design, database modeling, and authentication systems.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    sourceUrl: 'https://example.com/jobs/3',
    status: 'active',
  },
  {
    title: 'Senior Node.js Architect',
    company: 'CloudScale Inc',
    location: 'Remote',
    jobType: 'Contract',
    experienceLevel: '5+ yrs',
    salary: { min: 2500000, max: 3500000, currency: 'INR', isDisclosed: true },
    description: 'Lead high-throughput backend architecture, implement caching strategies with Redis, and mentor team members.',
    skills: ['Node.js', 'Redis', 'Docker', 'System Design', 'MongoDB'],
    sourceUrl: 'https://example.com/jobs/4',
    status: 'active',
  },
  {
    title: 'UI/UX & Frontend Engineer',
    company: 'Creative Design Studio',
    location: 'Mumbai, India',
    jobType: 'Full-time',
    experienceLevel: '0-2 yrs',
    salary: { min: 500000, max: 800000, currency: 'INR', isDisclosed: true },
    description: 'Craft pixel-perfect user interfaces and sleek micro-interactions using React and modern CSS architecture.',
    skills: ['React', 'CSS', 'Figma', 'JavaScript'],
    sourceUrl: 'https://example.com/jobs/5',
    status: 'active',
  },
  {
    title: 'Backend Intern',
    company: 'StartUp Nexus',
    location: 'Remote',
    jobType: 'Internship',
    experienceLevel: 'Fresher',
    salary: { min: 20000, max: 35000, currency: 'INR', isDisclosed: true },
    description: '3-month internship program for self-driven learners. Work closely with senior mentors on live API projects.',
    skills: ['JavaScript', 'Node.js', 'Express', 'Git'],
    sourceUrl: 'https://example.com/jobs/6',
    status: 'active',
  },
];

const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB.');

    console.log('🧹 Clearing existing mock jobs and dropping legacy indexes...');
    await Job.deleteMany({});
    await Job.collection.dropIndex('sourceUrl_1').catch(() => {
      // Ignore error if index doesn't exist
    });

    console.log('🌱 Seeding mock jobs...');
    const insertedJobs = await Job.insertMany(mockJobs);

    console.log(`🎉 Successfully seeded ${insertedJobs.length} jobs!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
