const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

const { assignment, assignments } = require('./queries/assignment');
const { chair, chairs } = require('./queries/chair');
const { subject, subjects } = require('./queries/subject');
const { tag, tags } = require('./queries/tag');
const { university, universitys } = require('./queries/university');
const { user, users, me } = require('./queries/user');
const { workshop, workshops } = require('./queries/workshop');

const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignmentWork,
} = require('./mutations/assignment');
const { createChair, updateChair, deleteChair } = require('./mutations/chair');
const {
  createSubject,
  updateSubject,
  deleteSubject,
} = require('./mutations/subject');
const { createTag, updateTag, deleteTag } = require('./mutations/tag');
const {
  createUniversity,
  updateUniversity,
  deleteUniversity,
} = require('./mutations/university');
const {
  createUser,
  createOrUpdateUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} = require('./mutations/user');
const {
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} = require('./mutations/workshop');

const typeDefs = `
  scalar Date
  scalar DateTime

  input FileInput {
    name: String
    type: String
  }

  type File {
    id: ID!
    name: String
    type: String
    url: String
  }

  input AssignmentInput {
    name: String
    shortDescription: String
    description: String
    type: String
    startsAt: Date
    endsAt: Date
    attachment: FileInput
    evaluationVariable: String
    tags: [ID]
    requiredWork: [RequiredWorkInput]
  }

  input RequiredWorkInput {
    type: String
    description: String
  }

  type RequiredWork {
    id: ID!
    type: String
    description: String
    assignmentWork: [AssignmentWork]
  }

  type Assignment {
    id: ID!
    name: String
    shortDescription: String
    description: String
    type: String
    startsAt: Date
    endsAt: Date
    attachment: File
    evaluationVariable: String
    tags: [Tag]
    requiredWork: [RequiredWork]
    updatedAt: DateTime
    createdAt: DateTime
  }

  input EvaluationInput {
    score1: Int
    score2: Int
    score3: Int
    score4: Int
    score5: Int
  }

  input AssignmentWorkInput {
    requiredWorkId: ID!
    attachment: FileInput
    content: String
  }

  input SubmitWorkInput {
    evaluation: EvaluationInput
    assignmentWork: [AssignmentWorkInput]
  }

  type AssignmentWork {
    id: ID!
    user: [User]
    attachment: File
    content: String
  }

  input ChairInput {
    name: String
  }

  type Chair {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  input SubjectInput {
    name: String
    code: String
  }

  type Subject {
    id: ID!
    code: String
    name: String
    updatedAt: DateTime
    createdAt: DateTime
  }

  input TagInput {
    name: String
    color: String
  }

  type Tag {
    id: ID!
    name: String
    color: String
    assignments: [Assignment]
    updatedAt: DateTime
    createdAt: DateTime
  }

  input UniversityInput {
    name: String
  }

  type University {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
  }

  input UserInput {
    firstName: String!
    lastName: String!
    completedProfile: Boolean!
    acceptedTerms: Boolean!
    receiveNews: Boolean!
    idNumber: String!
    email: String!
    password: String!
    workshop: ID!
    subjects: [ID!]!
    previouslyOnThisChair: Boolean
    previousYearOnThisChair: String
    website: String
    aboutMe: String
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    completedProfile: Boolean
    acceptedTerms: Boolean
    receiveNews: Boolean
    idNumber: String
    email: String
    workshop: Workshop
    subjects: [Subject]
    updatedAt: DateTime
    createdAt: DateTime
    previouslyOnThisChair: Boolean
    previousYearOnThisChair: String
    website: String
    aboutMe: String
  }

  input WorkshopInput {
    name: String
  }

  type Workshop {
    id: ID!
    name: String
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
    me: User

    workshop(id: ID!): Workshop
    workshops: [Workshop]
  }

  type Mutation {
    createAssignment(input: AssignmentInput!): Assignment
    updateAssignment(id: ID!, input: AssignmentInput!): Assignment
    deleteAssignment(id: ID!): Assignment

    submitAssignmentWork(id: ID!, input: SubmitWorkInput!): Assignment

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
    createOrUpdateUser(input: UserInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User
    loginUser(email: String!, password: String!): User
    logoutUser: Boolean

    createWorkshop(input: WorkshopInput!): Workshop
    updateWorkshop(id: ID!, input: WorkshopInput!): Workshop
    deleteWorkshop(id: ID!): Workshop
  }
`;

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Assignment: {
    tags,
  },
  Tag: {
    assignments,
  },
  Query: {
    assignment,
    assignments,

    chair,
    chairs,

    subject,
    subjects,

    tag,
    tags,

    university,
    universitys,

    user,
    users,
    me,

    workshop,
    workshops,
  },
  Mutation: {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignmentWork,

    createChair,
    updateChair,
    deleteChair,

    createSubject,
    updateSubject,
    deleteSubject,

    createTag,
    updateTag,
    deleteTag,

    createUniversity,
    updateUniversity,
    deleteUniversity,

    createUser,
    createOrUpdateUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,

    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
