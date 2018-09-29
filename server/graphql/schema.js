const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

const {
  assignment,
  assignments,
  myAssignments,
  pendingAssignments,
  completedAssignments,
  pendingEvaluationAssignments,
  completedEvaluationAssignments,
  statusTags,
} = require('./queries/assignment');
const { chair, chairs } = require('./queries/chair');
const { subject, subjects } = require('./queries/subject');
const { tag, tags } = require('./queries/tag');
const { university, universitys } = require('./queries/university');
const {
  userByRef, user, users, me, myStudents,
} = require('./queries/user');
const { workshop, workshops, myWorkshops } = require('./queries/workshop');

const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignmentWork,
  submitAssignmentEvaluation,
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
    assignmentWork: AssignmentWork
    assignmentWorks: [AssignmentWork]
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
    evaluation: Evaluation
    evaluations: [Evaluation]
    workshop: Workshop
    statusTags: [String]
    updatedAt: DateTime
    createdAt: DateTime
  }

  input EvaluationInput {
    score1: Float
    score2: Float
    score3: Float
    score4: Float
    score5: Float
    observations: String
  }

  type Evaluation {
    id: ID!
    score1: Float
    score2: Float
    score3: Float
    score4: Float
    score5: Float
    observations: String
    user: User
    targetUser: User
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

  input SubmitAssignmentEvaluationInput {
    targetUser: ID!
    evaluation: EvaluationInput
  }

  type AssignmentWork {
    id: ID!
    user: User
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
    fullName: String!
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
    tutoredWorkshops: [Workshop]
  }

  input WorkshopInput {
    name: String
  }

  type Workshop {
    id: ID!
    name: String
    tutors: [User]
    updatedAt: DateTime
    createdAt: DateTime
  }

  type Query {
    assignment(id: ID!): Assignment
    assignments: [Assignment]
    myAssignments: [Assignment]
    pendingAssignments: [Assignment]
    completedAssignments: [Assignment]
    pendingEvaluationAssignments: [Assignment]
    completedEvaluationAssignments: [Assignment]

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
    myStudents: [User]

    workshop(id: ID!): Workshop
    workshops: [Workshop]
    myWorkshops: [Workshop]
  }

  type Mutation {
    createAssignment(input: AssignmentInput!): Assignment
    updateAssignment(id: ID!, input: AssignmentInput!): Assignment
    deleteAssignment(id: ID!): Assignment

    submitAssignmentWork(id: ID!, input: SubmitWorkInput!): Assignment
    submitAssignmentEvaluation(id: ID!, input: SubmitAssignmentEvaluationInput!): Assignment

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
    workshop,
    statusTags,
  },
  AssignmentWork: {
    user,
  },
  Evaluation: {
    user,
    targetUser: userByRef('targetUser'),
  },
  Tag: {
    assignments,
  },
  Workshop: {
    tutors: users,
  },
  User: {
    tutoredWorkshops: workshops,
  },
  Query: {
    assignment,
    assignments,
    myAssignments,
    pendingAssignments,
    completedAssignments,
    pendingEvaluationAssignments,
    completedEvaluationAssignments,

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
    myStudents,

    workshop,
    workshops,
    myWorkshops,
  },
  Mutation: {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignmentWork,
    submitAssignmentEvaluation,

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
