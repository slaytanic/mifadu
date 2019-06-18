const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

const {
  assignment,
  assignments,
  statusTags,
  assignmentWork,
  selfEvaluation,
  myGroup,
  canEdit,
  canSubmit,
} = require('./queries/assignment');
const { chair, chairs } = require('./queries/chair');
const { subject, subjects } = require('./queries/subject');
const { tag, tags } = require('./queries/tag');
const { university, universities } = require('./queries/university');
const { userByRef, usersByRef, user, users, members, memberCount, me } = require('./queries/user');
const { workshop, workshops, isTutor } = require('./queries/workshop');
const { avatar, avatars } = require('./queries/avatar');

const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignmentWork,
  submitAssignmentSelfEvaluation,
  submitAssignmentEvaluation,
  // assignUserToGroup,
} = require('./mutations/assignment');
const { createChair, updateChair, deleteChair } = require('./mutations/chair');
const { createSubject, updateSubject, deleteSubject } = require('./mutations/subject');
const { createTag, updateTag, deleteTag } = require('./mutations/tag');
const { createUniversity, updateUniversity, deleteUniversity } = require('./mutations/university');
const {
  createUser,
  createOrUpdateUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  recoverPassword,
  resetPassword,
} = require('./mutations/user');
const { createWorkshop, updateWorkshop, deleteWorkshop } = require('./mutations/workshop');
const { createAvatar, deleteAvatar } = require('./mutations/avatar');

const typeDefs = `
  scalar Date
  scalar DateTime

  type File {
    id: ID!
    filename: String!
    filetype: String!
    encoding: String!
    publicId: String!
    url: String!
    secureUrl: String!
    format: String!
  }

  type Avatar {
    id: ID!
    filename: String!
    filetype: String!
    encoding: String!
    publicId: String!
    url: String!
    secureUrl: String!
    format: String!
  }

  enum AssignmentType {
    Group
    Individual
  }

  input AssignmentInput {
    name: String
    shortDescription: String
    description: String
    type: AssignmentType
    startsAt: Date
    endsAt: Date
    attachment: Upload
    evaluationVariable: String
    tags: [ID]
    requiredWork: [RequiredWorkInput]
    workshop: ID
  }

  enum RequiredWorkType {
    JPG
    PDF
    Video
    URL
  }

  input RequiredWorkInput {
    id: ID
    type: RequiredWorkType
    description: String
  }

  type RequiredWork {
    id: ID!
    type: String
    description: String
    assignmentWork: AssignmentWork
    assignmentWorks: [AssignmentWork]
  }

  type Group {
    number: Int
    users: [User]
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
    selfEvaluation: Evaluation
    evaluations: [Evaluation]
    workshop: Workshop
    statusTags: [String]
    completedWorksCount: Int
    evaluatedWorksCount: Int
    pendingEvaluationWorksCount: Int
    completedBy: [User]
    usersWithEvaluations: [User]
    usersWithoutEvaluations: [User]
    myGroup: Group
    canEdit: Boolean!
    canSubmit: Boolean!
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
    attachment: Upload
    content: String
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
    previousYearOnThisChair: Int
    website: String
    aboutMe: String
    avatar: ID
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
    workshops: [Workshop]
    subjects: [Subject]
    updatedAt: DateTime
    createdAt: DateTime
    previouslyOnThisChair: Boolean
    previousYearOnThisChair: Int
    website: String
    aboutMe: String
    tutoredWorkshops: [Workshop]
    avatar: Avatar
  }

  input WorkshopInput {
    name: String
    year: Int
  }

  enum AssignmentStatus {
    pending
    completed
  }

  type Workshop {
    id: ID!
    name: String!
    year: Int!
    tutors: [User!]!
    members: [User!]!
    students: [User!]!
    memberCount: Int!
    assignments(status: AssignmentStatus): [Assignment!]!
    assignmentCount(status: AssignmentStatus): Int!
    pendingAssignmentCount: Int!
    completedAssignmentsCount: Int!
    pendingEvaluationAssignments: [Assignment!]!
    completedEvaluationAssignments: [Assignment!]!
    isTutor: Boolean!
    updatedAt: DateTime!
    createdAt: DateTime!
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
    universities: [University]

    user(id: ID!): User
    users: [User]
    me: User

    workshop(id: ID!): Workshop
    workshops: [Workshop]

    avatar(id: ID!): Avatar
    avatars(id: ID!): [Avatar]!
  }

  type Mutation {
    createAssignment(input: AssignmentInput!): Assignment
    updateAssignment(id: ID!, input: AssignmentInput!): Assignment
    deleteAssignment(id: ID!): Assignment

    submitAssignmentWork(id: ID!, input: AssignmentWorkInput!): Assignment
    removeAssignmentWork(id: ID!, assignmentWorkId: ID!): Assignment
    submitAssignmentSelfEvaluation(id: ID!, input: EvaluationInput!): Assignment
    submitAssignmentEvaluation(id: ID!, targetUser: ID!, input: EvaluationInput!): Assignment

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
    recoverPassword(email: String!): Boolean
    resetPassword(password: String!, recoveryToken: String!): User

    createWorkshop(input: WorkshopInput!): Workshop
    updateWorkshop(id: ID!, input: WorkshopInput!): Workshop
    deleteWorkshop(id: ID!): Workshop

    createAvatar(file: Upload!): Avatar
    deleteAvatar(id: ID!): Avatar
  }
`;

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Assignment: {
    tags,
    workshop,
    statusTags,
    selfEvaluation,
    completedBy: usersByRef('completedBy'),
    usersWithEvaluations: usersByRef('usersWithEvaluations'),
    usersWithoutEvaluations: usersByRef('usersWithoutEvaluations'),
    myGroup,
    canEdit,
    canSubmit,
  },
  AssignmentWork: {
    user,
  },
  RequiredWork: {
    assignmentWork,
  },
  Evaluation: {
    user,
    targetUser: userByRef('targetUser'),
  },
  Tag: {
    assignments,
  },
  Workshop: {
    isTutor,
    tutors: usersByRef('tutors'),
    members,
    memberCount,
    // assignments: workshopAssignments,
    // pendingAssignmentCount: workshopPendingAssignmentCount,
    // completedAssignmentCount: workshopPendingAssignmentCount,
  },
  User: {
    workshop,
    workshops,
    subjects,
    avatar,
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
    universities,

    user,
    users,
    me,

    workshop,
    workshops,

    avatar,
    avatars,
  },
  Mutation: {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignmentWork,
    submitAssignmentSelfEvaluation,
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
    recoverPassword,
    resetPassword,

    createWorkshop,
    updateWorkshop,
    deleteWorkshop,

    createAvatar,
    deleteAvatar,
  },
};

module.exports.typeDefs = typeDefs;
module.exports.resolvers = resolvers;
