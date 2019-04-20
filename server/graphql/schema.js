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
  assignmentWork,
  selfEvaluation,
  myGroup,
  workshopAssignments,
} = require('./queries/assignment');
const { chair, chairs } = require('./queries/chair');
const { subject, subjects } = require('./queries/subject');
const { tag, tags } = require('./queries/tag');
const { university, universitys } = require('./queries/university');
const {
  userByRef, usersByRef, user, users, me, myStudents,
} = require('./queries/user');
const {
  workshopsByRef, workshop, workshops, myWorkshops,
} = require('./queries/workshop');
const { avatar, avatars } = require('./queries/avatar');

const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignmentWork,
  submitAssignmentSelfEvaluation,
  submitAssignmentEvaluation,
  assignUserToGroup,
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
    name: String
    type: String
    url: String
    cloudName: String
    publicId: String
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

  input AssignmentInput {
    name: String
    shortDescription: String
    description: String
    type: String
    startsAt: Date
    endsAt: Date
    attachment: Upload
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
    workshops: [WorkshopAndYear!]
    subjects: [Subject]
    updatedAt: DateTime
    createdAt: DateTime
    previouslyOnThisChair: Boolean
    previousYearOnThisChair: String
    website: String
    aboutMe: String
    tutoredWorkshops: [Workshop]
    assignments: [Assignment]!
    pendingAssignments: [Assignment]!
    completedAssignments: [Assignment]!
    avatar: Avatar
  }

  input WorkshopInput {
    name: String
  }

  type Workshop {
    id: ID!
    name: String!
    tutors: [User!]
    members: [User!]
    memberCount: Int!
    assignments(status: String, year: Int): [Assignment]!
    updatedAt: DateTime!
    createdAt: DateTime!
  }

  type WorkshopAndYear {
    id: ID!
    year: Int!
    workshop: Workshop!
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

    avatar(id: ID!): Avatar
    avatars(id: ID!): [Avatar]!
  }

  type Mutation {
    createAssignment(input: AssignmentInput!): Assignment
    updateAssignment(id: ID!, input: AssignmentInput!): Assignment
    deleteAssignment(id: ID!): Assignment

    submitAssignmentWork(id: ID!, input: SubmitWorkInput!): Assignment
    submitAssignmentSelfEvaluation(id: ID!, input: EvaluationInput!): Assignment
    submitAssignmentEvaluation(id: ID!, input: SubmitAssignmentEvaluationInput!): Assignment

    assignUserToGroup(assignmentId: ID!, number: Int!, userId: ID): Assignment

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
    tutors: usersByRef('tutors'),
    members: usersByRef('members'),
    assignments: workshopAssignments,
  },
  WorkshopAndYear: {
    workshop,
  },
  User: {
    tutoredWorkshops: workshopsByRef('tutors'),
    assignments: myAssignments,
    pendingAssignments,
    completedAssignments,
    workshop,
    subjects,
    avatar,
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
    assignUserToGroup,

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
