'use strict'

const Project = use('App/Models/Project');
const Authorization = use('App/Services/AuthorizationServices');

class ProjectController {

    // fetch all projects that associate with spesific user
    async index({ auth }) {
        const user = await auth.getUser();
        return await user.projects().fetch();
    }

    // store new project record in database
    async create({ request, auth }) {
        const user = await auth.getUser();
        const { title } = request.all();
        const project = new Project();
        project.fill({
            title
        })
        await user.projects().save(project);
        return project;
    }


    // destroy project record
    async destroy({ auth, request, params }) {
        const user = await auth.getUser();
        const { id } = params;
        const project = await Project.find(id);
        Authorization.verifyPermissions(project, user); // create authoraization sevices and exceptions
        await project.delete();
        return project;

    }

    // update project record
    async update({ auth, request, params }) {
        const user = await auth.getUser();
        const { id } = params;
        const project = await Project.find(id);
        Authorization.verifyPermissions(project, user); // create authoraization sevices and exceptions
        project.merge(request.only(['title']));
        await project.save();
        return project;
    }
}

module.exports = ProjectController;