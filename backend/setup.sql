-- Create database if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'campus_link') THEN
        CREATE DATABASE campus_link;
    END IF;
END $$;

\c campus_link;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    "avatarUrl" TEXT,
    "studentId" VARCHAR(255) UNIQUE,
    department VARCHAR(255),
    "yearOfStudy" INTEGER,
    phone VARCHAR(50),
    address TEXT,
    "dateOfBirth" DATE,
    "emergencyContact" VARCHAR(255),
    "emergencyPhone" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "eventType" VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "organizerId" UUID REFERENCES users(id),
    department VARCHAR(255),
    "isPublic" BOOLEAN DEFAULT true,
    "maxAttendees" INTEGER,
    "registrationRequired" BOOLEAN DEFAULT false,
    "registrationDeadline" TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);