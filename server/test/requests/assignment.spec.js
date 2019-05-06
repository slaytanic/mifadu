const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const userFactory = require('../factories/user');
const tagFactory = require('../factories/tag');

describe('Assignment', () => {
  let testUser;
  let testTutor;

  before(async () => {
    testUser = await userFactory.testUser();
    testTutor = await userFactory.testTutor();
  });

  context('tutor', () => {
    it('can create an assignment for a tutored workshop', async () => {
      const testTag = await tagFactory.testTag();
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testTutor.token}`)
        .send({
          query: `
            mutation($input: AssignmentInput!) {
              createAssignment(input: $input) {
                id
                name
                shortDescription
                description
                type
                startsAt
                endsAt
                evaluationVariable
                tags {
                  id
                  name
                }
                requiredWork {
                  id
                  type
                  description
                }
                workshop {
                  id
                }
              }
            }
          `,
          variables: {
            input: {
              name: 'Test assignment',
              shortDescription: 'Short description',
              description: 'Description',
              type: 'Individual',
              startsAt: '2019-01-01',
              endsAt: '2019-01-30',
              evaluationVariable: 'Variable',
              tags: testTag._id,
              requiredWork: [{ type: 'JPG', description: 'JPG' }],
              workshop: testTutor.workshops[0],
            },
          },
        });

      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;

      const assignment = response.body.data.createAssignment;
      expect(assignment.id).not.to.be.null;
      expect(assignment.name).to.eql('Test assignment');
      expect(assignment.shortDescription).to.eql('Short description');
      expect(assignment.description).to.eql('Description');
      expect(assignment.type).to.eql('Individual');
      expect(assignment.startsAt).to.eql('2019-01-01');
      expect(assignment.endsAt).to.eql('2019-01-30');
      expect(assignment.evaluationVariable).to.eql('Variable');
      assignment.tags.forEach(tag => {
        expect(tag.id).to.eql(testTag._id.toString());
        expect(tag.name).to.eql(testTag.name);
      });
      assignment.requiredWork.forEach(rw => {
        expect(rw.id).not.to.be.null;
        expect(rw.type).to.eql('JPG');
        expect(rw.description).to.eql('JPG');
      });
      expect(assignment.workshop.id).to.eql(testTutor.workshops[0].toString());
    });

    it.skip('can not create an assignment for a non-tutored workshop', async () => {});

    it.skip("can submit an evaluation for a tutored workshop's assignment", async () => {});
    it.skip("can not submit an evaluation for a non-tutored workshop's assignment", async () => {});
  });

  context('student', () => {
    it.skip('can not create an assignment', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            mutation($input: AssignmentInput!) {
              createAssignment(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              name: 'Test Assignment',
            },
          },
        });

      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.createAssignment).to.be.null;
    });

    it.skip('can submit an assignment', async () => {});

    it.skip('can submit a self-evaluation for an assignment', async () => {});
  });
});
