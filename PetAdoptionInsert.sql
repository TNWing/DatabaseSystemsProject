INSERT INTO Breeds (breed_id, bname, btype)
VALUES 
    (1, 'Golden Retriever', 'Dog'),
    (2, 'Tabby', 'Cat'),
    (3, 'Labrador Retriever', 'Dog'),
    (4, 'Siamese', 'Cat');


INSERT INTO People (user_id, name, contact_info, address, DOB)
VALUES 
    (1, 'John Doe', 'john@example.com', '123 Main St', '1990-05-15'),
    (2, 'Jane Smith', 'jane@example.com', '456 Elm St', '1985-08-20'),
	(3, 'Joe Smith', 'joe@example.com', '678 Day St', '1999-09-17');
	

INSERT INTO Pets (pet_id, pname, species, breed_id, age, description)
VALUES 
    (1, 'Buddy', 'Dog', 1, 3, 'Golden Retriever'),
    (2, 'Whiskers', 'Cat', 2, 5, 'Tabby');

INSERT INTO Adopter (user_id, pet_id, adopt_history)
VALUES 
    (1, 1, 'Adopted Buddy on 2023-01-10'),
    (2, 2, 'Adopted Whiskers on 2022-12-05');
	
INSERT INTO Organization (org_id, contact_info, oname, location)
VALUES 
    (1, 'info@animalshelter.org', 'Local Animal Shelter', '123 Oak St'),
    (2, 'info@rescuegroup.org', 'Rescue Group', '789 Pine St');

INSERT INTO Staff (user_id, org_id, task)
VALUES 
    (3, 1, 'Manager'),
    (2, 2, 'Trainer');

INSERT INTO Volunteer (user_id, org_id, hours_worked, task)
VALUES 
    (1, 1, 20, 'Animal care'),
    (2, 2, 15, 'Event planning');

INSERT INTO Donor (user_id)
VALUES 
    (1),
    (2);

INSERT INTO Donation (donation_id, donor_id, amount, description)
VALUES 
    (1, 1, 100.00, 'General donation'),
    (2, 2, 50.00, 'Food donation');


INSERT INTO Resources (r_id, URL, notes, org_id)
VALUES 
    (1, 'https://animalshelter.org/resources', 'Shelter resources page', 1),
    (2, 'https://rescuegroup.org/resources', 'Rescue group resources page', 2);

INSERT INTO Shelter_Resources (r_id, capacity)
VALUES 
    (1, 100),
    (2, 50);

INSERT INTO Adoption_Resources (r_id, adoption_fee)
VALUES 
    (1, 50.00),
    (2, 75.00);

INSERT INTO Pet_Resources (r_id, pet_food_brand)
VALUES 
    (1, 'Acme Pet Food'),
    (2, 'Paws & Claws');


