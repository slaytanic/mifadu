const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const Workshop = require('../../models/workshop');
const userFactory = require('../factories/user');

describe('User', () => {
  let testUser;
  let testTutor;

  before(async () => {
    testUser = await userFactory.testUser();
    testTutor = await userFactory.testTutor();
  });

  context('login', () => {
    it('shows null if not logged in', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            query {
              me {
                email
              }
            }
          `,
        });

      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.me).to.be.null;
    });

    it('shows the user if logged in', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query {
              me {
                email
              }
            }
          `,
        });

      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.me.email).to.equal(testUser.email);
    });
  });

  context('workshops', () => {
    it('can tell if I am a tutor', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testTutor.token}`)
        .send({
          query: `
            query {
              me {
                workshops {
                  isTutor
                }
              }
            }
          `,
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.me.workshops).to.deep.include({ isTutor: true });
    });

    it('can tell if I am not a tutor', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query {
              me {
                workshops {
                  isTutor
                }
              }
            }
          `,
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.me.workshops).not.to.deep.include({ isTutor: true });
    });

    it('can belong to multiple workshops during different years', async () => {
      const currentYear = new Date().getFullYear();
      const workshops = await Promise.all(
        [currentYear - 1, currentYear].map(async year => {
          const args = { name: 'Diseño 1', year };
          let workshop = await Workshop.findOne(args);
          if (!workshop) {
            workshop = Workshop.create(args);
          }
          return workshop;
        }),
      );
      testUser.set({ workshops: workshops.map(w => w._id) });
      await testUser.save();

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query {
              me {
                workshops {
                  name
                  year
                }
              }
            }
          `,
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.me.workshops).to.have.deep.members([
        { name: 'Diseño 1', year: currentYear },
        { name: 'Diseño 1', year: currentYear - 1 },
      ]);
    });

    it('displays the number of members in the workshop', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query {
              me {
                workshops {
                  members {
                    id
                  }
                  memberCount
                }
              }
            }
          `,
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      response.body.data.me.workshops.forEach(workshop => {
        expect(workshop.memberCount).to.equal(workshop.members.length);
      });
    });

    it('displays the number of pending assignments for me in the workshop', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query($status: AssignmentStatus!) {
              me {
                workshops {
                  assignments(status: $status) {
                    id
                  }
                  pendingAssignmentCount
                }
              }
            }
          `,
          variables: {
            status: 'pending',
          },
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      response.body.data.me.workshops.forEach(workshop => {
        expect(workshop.pendingAssignmentCount).to.equal(workshop.assignments.length);
      });
    });

    it('displays the number of completed assignments for me in the workshop', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query($status: AssignmentStatus!) {
              me {
                workshops {
                  assignments(status: $status) {
                    id
                  }
                  completedAssignmentCount
                }
              }
            }
          `,
          variables: {
            status: 'completed',
          },
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      response.body.data.me.workshops.forEach(workshop => {
        expect(workshop.completedAssignmentCount).to.equal(workshop.assignments.length);
      });
    });

    it('displays the number of total assignments for me in the workshop', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query {
              me {
                workshops {
                  assignments {
                    id
                  }
                  assignmentCount
                }
              }
            }
          `,
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      response.body.data.me.workshops.forEach(workshop => {
        expect(workshop.assignmentCount).to.equal(workshop.assignments.length);
      });
    });

    it('displays the workshop for the current year if set', async () => {
      const currentYear = new Date().getFullYear();
      const args = { name: 'Diseño 1', currentYear };
      let workshop = await Workshop.findOne(args);
      if (!workshop) {
        workshop = Workshop.create(args);
      }
      testUser.set({ workshop: workshop._id });
      await testUser.save();

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          query: `
            query {
              me {
                workshop {
                  name
                  year
                }
              }
            }
          `,
        });
      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.me.workshop).to.eql({ name: 'Diseño 1', year: currentYear });
    });
  });
});
