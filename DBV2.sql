DROP TABLE Breed_Species_Relationship;
DROP TABLE Is_Breed_Type;
DROP TABLE PetImage_Belongs;
DROP TABLE Medical_Record;
DROP TABLE Adoption_Record;
DROP TABLE PetRecord;
DROP TABLE Pets_Have;
DROP TABLE Adopt;
DROP TABLE Pets;
DROP TABLE Species;
DROP TABLE Breed;
DROP TABLE Works_For;
DROP TABLE Donate;
DROP TABLE Provides_Resources;
DROP TABLE Resources;
DROP TABLE Organization;
DROP TABLE Volunteer;
DROP TABLE Veterinarian;
DROP TABLE Staff;
DROP TABLE Employee;
DROP TABLE Users;

CREATE TABLE Users (
    userID VARCHAR(9) PRIMARY KEY,
    Fname VARCHAR(20),
    Lname VARCHAR(20),
    Email VARCHAR(50),
    PhoneNumber VARCHAR(10),
    Address VARCHAR(70)
);

CREATE TABLE Employee (
    EmployeeID VARCHAR(7),
    userID VARCHAR(9) PRIMARY KEY,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Staff (
    EmployeeID VARCHAR(7),
    userID VARCHAR(9),
    Position VARCHAR(30),
    PRIMARY KEY (userID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE Veterinarian (
    EmployeeID VARCHAR(7),
    userID VARCHAR(9) PRIMARY KEY,
    Specialty VARCHAR(30),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Volunteer (
    EmployeeID VARCHAR(7),
    userID VARCHAR(9) PRIMARY KEY,
    Flag NUMBER(1),
    Vol_type VARCHAR(40),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Works_For (
    EmployeeID VARCHAR(7),
    Org_id VARCHAR(4),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE Organization (
    Org_id VARCHAR(4) PRIMARY KEY,
    Email VARCHAR(50),
    PhoneNumber VARCHAR(10),
    Location VARCHAR(70)
);

CREATE TABLE Resources (
    ResourceNum VARCHAR(2),
    resourceURL VARCHAR(999),
    PRIMARY KEY (ResourceNum)
);

CREATE TABLE Provides_Resources (
    ResourceNum VARCHAR(2),
    Org_id VARCHAR(4),
    PRIMARY KEY (ResourceNum, Org_id),
    FOREIGN KEY (ResourceNum) REFERENCES Resources(ResourceNum),
    FOREIGN KEY (Org_id) REFERENCES Organization(Org_id)
);

CREATE TABLE Donate (
    userID VARCHAR(9),
    Org_id VARCHAR(4),
    Amount REAL,
    PRIMARY KEY (userID, Org_id),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (Org_id) REFERENCES Organization(Org_id)
);

CREATE TABLE Adopt (
    userID VARCHAR(9),
    petID VARCHAR(6),
    adoptID VARCHAR(7),
    PRIMARY KEY (userID, petID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Pets (
    petID VARCHAR(6) PRIMARY KEY,
    Pname VARCHAR(30),
    DOB DATE
);

CREATE TABLE Pets_Have (
    petID VARCHAR(6),
    RecordID VARCHAR(7),
    PRIMARY KEY (petID, RecordID),
    FOREIGN KEY (petID) REFERENCES Pets(petID)
);

CREATE TABLE PetRecord (
    RecordID VARCHAR(7) PRIMARY KEY,
    Date DATE
);

CREATE TABLE Adoption_Record (
    RecordID VARCHAR(7),
    Duration VARCHAR(50),
    PRIMARY KEY (RecordID),
    FOREIGN KEY (RecordID) REFERENCES PetRecord(RecordID)
);

CREATE TABLE Medical_Record (
    RecordID VARCHAR(7),
    Type VARCHAR(15),
    PRIMARY KEY (RecordID),
    FOREIGN KEY (RecordID) REFERENCES PetRecord(RecordID)
);

CREATE TABLE PetImage_Belongs (
    ImageID VARCHAR(5) PRIMARY KEY,
    imageURL VARCHAR(999)
);

CREATE TABLE Breed (
    breedID VARCHAR(6) PRIMARY KEY,
    Bname VARCHAR(50)
);

CREATE TABLE Is_Breed_Type (
    petID VARCHAR(6),
    breedID VARCHAR(6),
    PRIMARY KEY (petID, breedID),
    FOREIGN KEY (petID) REFERENCES Pets(petID),
    FOREIGN KEY (breedID) REFERENCES Breed(breedID)
);

CREATE TABLE Species (
    speciesID VARCHAR(3) PRIMARY KEY,
    Sname VARCHAR(20)
);

CREATE TABLE Breed_Species_Relationship (
    breedID VARCHAR(6),
    speciesID VARCHAR(3),
    petID VARCHAR(20),
    PRIMARY KEY (breedID, speciesID, petID),
    FOREIGN KEY (breedID) REFERENCES Breed(breedID),
    FOREIGN KEY (speciesID) REFERENCES Species(speciesID),
    FOREIGN KEY (petID) REFERENCES Pets(petID)
);
