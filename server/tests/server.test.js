const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    completed: true,
    completedAt: 333
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({
                text: text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('Should not to do with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({
                text: ''
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => {
                    done(err);
                });
            })
    });

    describe('Get /todos', () => {
        it('should get all todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        });
    })

    describe('GET /todos/:id', () => {
        it('should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })*
                .end(done);
        });

        it('should return 404 if todo not found', (done) => {
            var hexId = new ObjectID().toHexString();

            request(app)
                .get(`/todos/${hexId}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object id', (done) => {
            request(app)
                .get(`/todos/1234`)
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /todo/:id', () => {
        it('should remove to do', (done) => {
            var hexId = todos[1]._id.toHexString();

            request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexId);
                })
                .end((err, res) => {
                    if (err) {
                        return done();
                    }
                    Todo.findById(hexId).then((todo) => {
                        console.log(todo);
                        expect(todo).toBeNull();
                        done();
                    }, (err) => {
                        done(err);
                    });
                });
        });

        it('should return 404 if todo not found', (done) => {
            var hexId = new ObjectID().toHexString();

            request(app)
                .delete(`/todos/${hexId}`)
                .expect(404)
                .end(done);

        });

        it('should return 404 if ObjectId is invalid', (done) => {
            request(app)
                .delete(`/todos/1234`)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /todo/:id', () => {
        it('should update todo', (done) => {
            var todoId = todos[0]._id.toHexString();
            var text = 'This is form postman Vadim';

            request(app)
                .patch(`/todos/${todoId}`)
                .send({
                    "text": "This is form postman Vadim",
                    "completed": true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(typeof res.body.todo.completedAt).toBe('number');
                }).end(done);

        });

        it('should clear completed when todo is not completed', (done) => {
            var todoId = todos[1]._id.toHexString();
            var text = 'This is form postman Vadim';

            request(app)
                .patch(`/todos/${todoId}`)
                .send({
                    "text": text,
                    "completed": false
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toBeNull();
                }).end(done);
        });
    });
});