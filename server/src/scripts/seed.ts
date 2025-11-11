import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';
import { Property } from '../models/Property.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('Cleared existing data');

    // Create landlords
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const landlords = await User.create([
      {
        email: 'john.landlord@example.com',
        password: hashedPassword,
        userType: 'landlord',
        firstName: 'John',
        lastName: 'Smith',
        phone: '555-0101',
        bio: 'Experienced property owner with 10+ years in real estate'
      },
      {
        email: 'sarah.landlord@example.com',
        password: hashedPassword,
        userType: 'landlord',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '555-0102',
        bio: 'Professional property manager specializing in residential rentals'
      },
      {
        email: 'mike.landlord@example.com',
        password: hashedPassword,
        userType: 'landlord',
        firstName: 'Mike',
        lastName: 'Davis',
        phone: '555-0103',
        bio: 'Family-owned properties, committed to quality housing'
      }
    ]);

    console.log('Created landlords');

    // Create renters
    await User.create([
      {
        email: 'emma.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Emma',
        lastName: 'Wilson',
        phone: '555-0201',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        bio: 'Software engineer at a leading tech company with 5 years of rental history. I work remotely and value a quiet, well-maintained living space. I\'m organized, pay rent on time, and treat properties with respect. Looking for a long-term rental where I can settle down.',
        renterProfile: {
          yearsOfExperience: 5,
          previousAddresses: [
            '456 Oak Street, San Francisco, CA (2021-2023)',
            '789 Pine Avenue, Berkeley, CA (2019-2021)'
          ],
          employmentStatus: 'Full-time Software Engineer',
          monthlyIncome: 8500,
          hasPets: false,
          smoker: false,
          references: [
            {
              name: 'Robert Johnson',
              relationship: 'Previous Landlord',
              phone: '555-1234',
              email: 'robert.j@example.com'
            },
            {
              name: 'Sarah Martinez',
              relationship: 'Employer - Tech Lead',
              phone: '555-5678',
              email: 'sarah.m@techcorp.com'
            }
          ],
          feedbackCount: 12,
          rating: 4.8
        }
      },
      {
        email: 'alex.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Alex',
        lastName: 'Brown',
        phone: '555-0202',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        bio: 'PhD candidate in Environmental Science at UC Berkeley. Quiet, studious, and extremely responsible. I have a well-behaved indoor cat and maintain a clean, organized living space. Non-smoker with excellent academic and rental references.',
        renterProfile: {
          yearsOfExperience: 3,
          previousAddresses: [
            '123 College Ave, Berkeley, CA (2021-Present)'
          ],
          employmentStatus: 'Graduate Student & Teaching Assistant',
          monthlyIncome: 3200,
          hasPets: true,
          petDetails: 'One small cat (Luna, 3 years old), spayed, indoor only, up-to-date on vaccinations',
          smoker: false,
          references: [
            {
              name: 'Dr. Michael Chen',
              relationship: 'Academic Advisor & Professor',
              phone: '555-9012',
              email: 'mchen@berkeley.edu'
            },
            {
              name: 'Jennifer Park',
              relationship: 'Current Landlord',
              phone: '555-4567',
              email: 'jpark@rentals.com'
            }
          ],
          feedbackCount: 5,
          rating: 4.6
        }
      },
      {
        email: 'james.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'James',
        lastName: 'Taylor',
        phone: '555-0203',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        bio: 'Freelance UX/UI designer with 8 years of rental experience in the Bay Area. I work from home and maintain a professional home office. Excellent payment history, never missed rent, and always leave properties in better condition than I found them. References available from multiple previous landlords.',
        renterProfile: {
          yearsOfExperience: 8,
          previousAddresses: [
            '321 Market Street, San Francisco, CA (2020-2023)',
            '654 Valencia Street, San Francisco, CA (2018-2020)',
            '987 Mission Street, San Francisco, CA (2016-2018)'
          ],
          employmentStatus: 'Self-employed UX/UI Designer',
          monthlyIncome: 6500,
          hasPets: false,
          smoker: false,
          references: [
            {
              name: 'Linda Garcia',
              relationship: 'Previous Landlord (3 years)',
              phone: '555-3456',
              email: 'linda.g@properties.com'
            },
            {
              name: 'Tom Anderson',
              relationship: 'Previous Landlord (2 years)',
              phone: '555-7890',
              email: 'tom.a@realty.com'
            },
            {
              name: 'Rachel Kim',
              relationship: 'Client & Professional Reference',
              phone: '555-2345',
              email: 'rkim@designstudio.com'
            }
          ],
          feedbackCount: 18,
          rating: 4.9
        }
      },
      {
        email: 'maria.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        phone: '555-0204',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        bio: 'Registered nurse working at a local hospital with rotating shifts. Very clean, quiet, and respectful tenant. I understand the importance of maintaining a peaceful home environment. Non-smoker, no pets, and excellent credit score. Looking for a safe, comfortable place close to work.',
        renterProfile: {
          yearsOfExperience: 6,
          previousAddresses: [
            '234 Health Plaza, Oakland, CA (2020-Present)',
            '567 Medical Center Dr, San Jose, CA (2018-2020)'
          ],
          employmentStatus: 'Registered Nurse - Full-time',
          monthlyIncome: 7800,
          hasPets: false,
          smoker: false,
          references: [
            {
              name: 'Dr. Patricia Lee',
              relationship: 'Nursing Supervisor',
              phone: '555-2468',
              email: 'plee@hospital.org'
            },
            {
              name: 'Kevin White',
              relationship: 'Current Landlord',
              phone: '555-1357',
              email: 'kwhite@rentals.com'
            }
          ],
          feedbackCount: 9,
          rating: 5.0
        }
      },
      {
        email: 'david.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'David',
        lastName: 'Chen',
        phone: '555-0205',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
        bio: 'Financial analyst relocating to the Bay Area for work. Stable income, excellent credit, and professional demeanor. I travel occasionally for work but maintain my home meticulously. Non-smoker, no pets. Looking for a modern apartment with good amenities and parking.',
        renterProfile: {
          yearsOfExperience: 7,
          previousAddresses: [
            '890 Financial District, New York, NY (2019-2023)',
            '432 Wall Street, New York, NY (2017-2019)'
          ],
          employmentStatus: 'Senior Financial Analyst',
          monthlyIncome: 9200,
          hasPets: false,
          smoker: false,
          references: [
            {
              name: 'Margaret Thompson',
              relationship: 'Previous Landlord (4 years)',
              phone: '555-8901',
              email: 'mthompson@nyrentals.com'
            },
            {
              name: 'Robert Chang',
              relationship: 'Manager at Goldman Sachs',
              phone: '555-6789',
              email: 'rchang@gs.com'
            }
          ],
          feedbackCount: 14,
          rating: 4.9
        }
      },
      {
        email: 'sophia.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Sophia',
        lastName: 'Martinez',
        phone: '555-0206',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        bio: 'Elementary school teacher with a passion for creating a warm, welcoming home. I have a friendly golden retriever who is well-trained and loves people. Active in the community and looking for a pet-friendly rental with outdoor space. Non-smoker with stable employment.',
        renterProfile: {
          yearsOfExperience: 4,
          previousAddresses: [
            '678 School District Ave, Palo Alto, CA (2020-Present)'
          ],
          employmentStatus: 'Elementary School Teacher',
          monthlyIncome: 5400,
          hasPets: true,
          petDetails: 'Golden Retriever (Max, 4 years old), neutered, trained, friendly, up-to-date on all vaccinations and flea prevention',
          smoker: false,
          references: [
            {
              name: 'Principal Susan Davis',
              relationship: 'Employer - School Principal',
              phone: '555-3456',
              email: 'sdavis@paschool.edu'
            },
            {
              name: 'Mark Stevens',
              relationship: 'Current Landlord',
              phone: '555-7890',
              email: 'mstevens@properties.com'
            }
          ],
          feedbackCount: 7,
          rating: 4.7
        }
      },
      {
        email: 'michael.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Michael',
        lastName: 'O\'Brien',
        phone: '555-0207',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        bio: 'Retired military veteran now working as a project manager in construction. Extremely organized, disciplined, and respectful. 10+ years of rental history with perfect payment record. Non-smoker, no pets. Seeking a quiet, secure place to call home.',
        renterProfile: {
          yearsOfExperience: 12,
          previousAddresses: [
            '234 Veterans Way, San Diego, CA (2018-2022)',
            '567 Military Base Housing, San Diego, CA (2015-2018)',
            '890 Bayside Apartments, San Diego, CA (2012-2015)'
          ],
          employmentStatus: 'Construction Project Manager',
          monthlyIncome: 8800,
          hasPets: false,
          smoker: false,
          references: [
            {
              name: 'Colonel James Wright',
              relationship: 'Former Commanding Officer',
              phone: '555-2345',
              email: 'jwright@military.gov'
            },
            {
              name: 'Angela Morrison',
              relationship: 'Previous Landlord (4 years)',
              phone: '555-6789',
              email: 'amorrison@sdrentals.com'
            },
            {
              name: 'Frank Rodriguez',
              relationship: 'Current Employer - Construction Manager',
              phone: '555-9012',
              email: 'frodriguez@buildco.com'
            }
          ],
          feedbackCount: 22,
          rating: 5.0
        }
      },
      {
        email: 'lisa.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Lisa',
        lastName: 'Anderson',
        phone: '555-0208',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
        bio: 'Marketing professional working for a startup in San Francisco. Young, energetic, but respectful of neighbors and property rules. I enjoy hosting small gatherings occasionally but always keep noise levels appropriate. Non-smoker, no pets, excellent references.',
        renterProfile: {
          yearsOfExperience: 3,
          previousAddresses: [
            '345 Startup Hub, San Francisco, CA (2021-Present)'
          ],
          employmentStatus: 'Marketing Manager',
          monthlyIncome: 7200,
          hasPets: false,
          smoker: false,
          references: [
            {
              name: 'Jessica Wong',
              relationship: 'Current Landlord',
              phone: '555-4567',
              email: 'jwong@sfproperties.com'
            },
            {
              name: 'Brian Foster',
              relationship: 'CEO & Employer',
              phone: '555-8901',
              email: 'bfoster@startup.com'
            }
          ],
          feedbackCount: 6,
          rating: 4.5
        }
      },
      {
        email: 'carlos.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Carlos',
        lastName: 'Ramirez',
        phone: '555-0209',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
        bio: 'Chef at a Michelin-starred restaurant with unconventional hours but very quiet lifestyle. I appreciate quality living spaces and take pride in keeping my home clean and well-maintained. Non-smoker, no pets. Looking for a place with a good kitchen and close to public transit.',
        renterProfile: {
          yearsOfExperience: 6,
          previousAddresses: [
            '789 Culinary District, San Francisco, CA (2019-Present)',
            '234 Restaurant Row, Oakland, CA (2018-2019)'
          ],
          employmentStatus: 'Executive Chef',
          monthlyIncome: 6800,
          hasPets: false,
          smoker: false,
          references: [
            {
              name: 'Chef Antoine Dubois',
              relationship: 'Head Chef & Mentor',
              phone: '555-3456',
              email: 'adubois@restaurant.com'
            },
            {
              name: 'Patricia Nguyen',
              relationship: 'Current Landlord',
              phone: '555-7890',
              email: 'pnguyen@bayrentals.com'
            }
          ],
          feedbackCount: 11,
          rating: 4.8
        }
      },
      {
        email: 'amanda.renter@example.com',
        password: hashedPassword,
        userType: 'renter',
        firstName: 'Amanda',
        lastName: 'Foster',
        phone: '555-0210',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
        bio: 'Yoga instructor and wellness coach seeking a peaceful, zen-like living space. I practice what I preach - mindful living, cleanliness, and respect for shared spaces. I have two small, quiet cats. Non-smoker, vegetarian, and very community-oriented.',
        renterProfile: {
          yearsOfExperience: 5,
          previousAddresses: [
            '456 Wellness Center, Berkeley, CA (2020-Present)',
            '123 Meditation Lane, Oakland, CA (2019-2020)'
          ],
          employmentStatus: 'Yoga Instructor & Wellness Coach',
          monthlyIncome: 4800,
          hasPets: true,
          petDetails: 'Two cats (Zen & Lotus, both 2 years old), spayed/neutered, indoor only, very quiet and well-behaved',
          smoker: false,
          references: [
            {
              name: 'Sarah Patel',
              relationship: 'Yoga Studio Owner',
              phone: '555-2345',
              email: 'spatel@zenspace.com'
            },
            {
              name: 'David Kim',
              relationship: 'Current Landlord',
              phone: '555-6789',
              email: 'dkim@berkeleyrentals.com'
            }
          ],
          feedbackCount: 8,
          rating: 4.9
        }
      }
    ]);

    console.log('Created renters');

    // Create properties
    const properties = [
      {
        landlordId: landlords[0]._id,
        title: 'Modern Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown. Walking distance to restaurants, shops, and public transit. Features hardwood floors, stainless steel appliances, and in-unit laundry.',
        address: {
          street: '123 Main Street, Apt 4B',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA'
        },
        price: 3200,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1100,
        propertyType: 'apartment',
        amenities: ['Parking', 'Laundry', 'Gym', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        available: true,
        availableFrom: new Date('2024-12-01')
      },
      {
        landlordId: landlords[0]._id,
        title: 'Cozy Studio Near University',
        description: 'Perfect for students or young professionals. Quiet neighborhood, close to campus and public transportation. Utilities included.',
        address: {
          street: '456 College Ave',
          city: 'Berkeley',
          state: 'CA',
          zipCode: '94704',
          country: 'USA'
        },
        price: 1800,
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 450,
        propertyType: 'studio',
        amenities: ['Utilities Included', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80'
        ],
        available: true
      },
      {
        landlordId: landlords[1]._id,
        title: 'Spacious Family Home',
        description: 'Charming 4-bedroom house with large backyard. Great for families! Updated kitchen, two-car garage, and excellent school district.',
        address: {
          street: '789 Oak Street',
          city: 'San Jose',
          state: 'CA',
          zipCode: '95112',
          country: 'USA'
        },
        price: 4500,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2400,
        propertyType: 'house',
        amenities: ['Backyard', 'Garage', 'Dishwasher', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
        ],
        available: true,
        availableFrom: new Date('2024-11-15')
      },
      {
        landlordId: landlords[1]._id,
        title: 'Luxury Condo with Bay Views',
        description: 'Stunning 3-bedroom condo with panoramic bay views. High-end finishes, floor-to-ceiling windows, and access to building amenities including pool and fitness center.',
        address: {
          street: '321 Waterfront Blvd, Unit 1205',
          city: 'Oakland',
          state: 'CA',
          zipCode: '94607',
          country: 'USA'
        },
        price: 5200,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1800,
        propertyType: 'condo',
        amenities: ['Pool', 'Gym', 'Concierge', 'Parking', 'Bay Views'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80'
        ],
        available: true
      },
      {
        landlordId: landlords[2]._id,
        title: 'Charming Townhouse',
        description: 'Recently renovated 3-bedroom townhouse in quiet residential area. Private patio, attached garage, and modern appliances.',
        address: {
          street: '555 Elm Street',
          city: 'Palo Alto',
          state: 'CA',
          zipCode: '94301',
          country: 'USA'
        },
        price: 4200,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1650,
        propertyType: 'townhouse',
        amenities: ['Garage', 'Patio', 'Dishwasher', 'Laundry'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
          'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'
        ],
        available: true
      },
      {
        landlordId: landlords[2]._id,
        title: 'Affordable 1-Bedroom Apartment',
        description: 'Clean and comfortable 1-bedroom apartment. Perfect for singles or couples. On-site laundry and parking available.',
        address: {
          street: '888 Pine Street, Apt 2A',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94109',
          country: 'USA'
        },
        price: 2400,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 650,
        propertyType: 'apartment',
        amenities: ['Laundry', 'Parking'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80'
        ],
        available: true,
        availableFrom: new Date('2024-12-15')
      }
    ];

    await Property.create(properties);
    console.log('Created properties');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Landlords:');
    console.log('  - john.landlord@example.com / password123');
    console.log('  - sarah.landlord@example.com / password123');
    console.log('  - mike.landlord@example.com / password123');
    console.log('\nRenters:');
    console.log('  - emma.renter@example.com / password123');
    console.log('  - alex.renter@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
