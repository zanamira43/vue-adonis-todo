'use strict'

const Task = use('App/Models/Task');
const Project = use('App/Models/Project');
const Authorization = use('App/Services/AuthorizationServices');

class TaskController {


    // fetch all tasks
    async index({ auth, request, params }) {
        const user = await auth.getUser();
        const { id } = params;
        const project = await Project.find(id);
        Authorization.verifyPermissions(project, user); // create authoraization sevices and exceptions
        return await project.tasks().fetch();
    }

    // creat new task
    async create({ auth, request, params }) {
        const user = await auth.getUser();
        const { description } = request.all();
        const { id } = params;
        const project = await Project.find(id);
        Authorization.verifyPermissions(project, user); // create authoraization sevices and exceptions
        const task = new Task();
        task.fill({
            description
        });
        await project.tasks().save(task);
        return task;
    }

    // delete task record
    async destroy({ auth, request, params }) {
        const user = await auth.getUser();
        const { id } = params;
        const task = await Task.find(id);
        const project = await task.project().fetch();
        Authorization.verifyPermissions(project, user); // create authoraization sevices and exceptions
        await task.delete();
        return task;
    }

    // updaatee task record
    async update({ auth, request, params }) {
        const user = await auth.getUser();
        const { id } = params;
        const task = await Task.find(id);
        const project = await task.project().fetch();
        Authorization.verifyPermissions(project, user); // create authoraization sevices and exceptions
        task.merge(request.only([
            'description',
            'completed'
        ]));
        await task.save();
        return task;
    }
}

module.exports = TaskController;