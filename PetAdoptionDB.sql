-- Database: PetAdoption

-- DROP DATABASE IF EXISTS "PetAdoption";

CREATE DATABASE "PetAdoption"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	

CREATE TABLE Breeds (
    breed_id INT PRIMARY KEY,
    bname VARCHAR(255),
    btype VARCHAR(255)
);

CREATE TABLE Organization (
    org_id INT PRIMARY KEY,
    contact_info VARCHAR(255),
    oname VARCHAR(255),
    location VARCHAR(255)
);
	
CREATE TABLE Pets (
    pet_id INT PRIMARY KEY,
    pname VARCHAR(255),
    species VARCHAR(255),
    breed_id INT,
    age INT,
    description TEXT,
    FOREIGN KEY (breed_id) REFERENCES Breeds(breed_id)
);

CREATE TABLE People (
    user_id INT PRIMARY KEY,
    name VARCHAR(255),
    contact_info VARCHAR(255),
    address VARCHAR(255),
    DOB DATE
);

CREATE TABLE Adopter (
    user_id INT PRIMARY KEY,
    pet_id INT,
    adopt_history VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES People(user_id),
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);

CREATE TABLE Staff (
    user_id INT PRIMARY KEY,
    org_id INT,
    task VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES People(user_id),
    FOREIGN KEY (org_id) REFERENCES Organization(org_id)
);

CREATE TABLE Volunteer (
    user_id INT PRIMARY KEY,
    org_id INT,
    hours_worked INT,
    task VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES People(user_id),
    FOREIGN KEY (org_id) REFERENCES Organization(org_id)
);

CREATE TABLE Donor (
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES People(user_id)
);

CREATE TABLE Donation (
    donation_id INT PRIMARY KEY,
    donor_id INT,
    amount DECIMAL(10, 2),
    description TEXT,
    FOREIGN KEY (donor_id) REFERENCES Donor(user_id)
);

CREATE TABLE Resources (
    r_id INT PRIMARY KEY,
    URL VARCHAR(255),
    notes TEXT,
    org_id INT,
    FOREIGN KEY (org_id) REFERENCES Organization(org_id)
);

CREATE TABLE Shelter_Resources (
    r_id INT PRIMARY KEY,
    capacity INT,
    FOREIGN KEY (r_id) REFERENCES Resources(r_id)
);

CREATE TABLE Adoption_Resources (
    r_id INT PRIMARY KEY,
    adoption_fee DECIMAL(10, 2),
    FOREIGN KEY (r_id) REFERENCES Resources(r_id)
);

CREATE TABLE Pet_Resources (
    r_id INT PRIMARY KEY,
    pet_food_brand VARCHAR(255),
    FOREIGN KEY (r_id) REFERENCES Resources(r_id)
);

CREATE TABLE Pet_Record (
    record_id INT PRIMARY KEY,
    pet_id INT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);

CREATE TABLE Medical_Record (
    record_id INT PRIMARY KEY,
    date_of_visit DATE,
    type_of_visit VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (record_id) REFERENCES Pet_Record(record_id)
);

CREATE TABLE Adoption_Record (
    record_id INT PRIMARY KEY,
    rec_date DATE,
    prev_owner VARCHAR(255),
    duration INT,
    description TEXT,
    FOREIGN KEY (record_id) REFERENCES Pet_Record(record_id)
);

CREATE TABLE Adoption_Application (
    app_id INT PRIMARY KEY,
    status VARCHAR(50),
    user_id INT,
    pet_id INT,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES People(user_id),
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id),
    UNIQUE(user_id, pet_id)
);

CREATE TABLE Pet_Image (
    image_id INT PRIMARY KEY,
    image_url VARCHAR(255),
    pet_id INT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);

CREATE TABLE Pet_Report (
    report_id INT PRIMARY KEY,
    date DATE,
    pet_id INT,
    description TEXT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);
