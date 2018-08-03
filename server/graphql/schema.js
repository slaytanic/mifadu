const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLDateTime } = require('graphql-iso-date');

const typeDefs = `
  scalar DateTime
  
  type AssignmentInput {
    name: String
    shortDescription: String
    description: String
    type: String
    startsAt: DateTime
    endAt: DateTime
  }

  type Assignment {
    id: ID!
    name: String
    shortDescription: String
    description: String
    type: String
    startsAt: DateTime
    endAt: DateTime
    updatedAt: DateTime
    createdAt: DateTime
  }

  type ChairInput {
    name: String
  }

  type Chair {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  type SubjectInput {
    name: String
  }

  type Subject {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  type TagInput {
    name: String
    color: String
  }

  type Tag {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  type UniversityInput {
    name: String
  }

  type University {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  type UserInput {
    email: String
  }

  type User {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  type WorkshopInput {
    name: String
  }

  type Workshop {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  type Query {
    assignment(id: ID!): Assignment
    assignments: [Assignment]

    chair(id: ID!): Chair
    chairs: [Chair]

    subject(id: ID!): Subject
    subjects: [Subject]

    tag(id: ID!): Tag
    tags: [Tag]

    university(id: ID!): University
    universitys: [University]

    user(id: ID!): User
    users: [User]
    
    workshop(id: ID!): Workshop
    workshops: [Workshop]
  }

  type Mutation {
    createAssignment(input: AssignmentInput!): Assignment
    updateAssignment(id: ID!, input: AssignmentInput!): Assignment
    deleteAssignment(id: ID!): Assignment

    createChair(input: ChairInput!): Chair
    updateChair(id: ID!, input: ChairInput!): Chair
    deleteChair(id: ID!): Chair

    createSubject(input: SubjectInput!): Subject
    updateSubject(id: ID!, input: SubjectInput!): Subject
    deleteSubject(id: ID!): Subject

    createTag(input: TagInput!): Tag
    updateTag(id: ID!, input: TagInput!): Tag
    deleteTag(id: ID!): Tag

    createUniversity(input: UniversityInput!): University
    updateUniversity(id: ID!, input: UniversityInput!): University
    deleteUniversity(id: ID!): University

    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User

    createWorkshop(input: WorkshopInput!): Workshop
    updateWorkshop(id: ID!, input: WorkshopInput!): Workshop
    deleteWorkshop(id: ID!): Workshop
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
