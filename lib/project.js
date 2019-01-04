const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');


module.exports = {
  pathArray: [
    '../assets/',
    '../public/',
    '../views/'
  ],
  isExist(folderPath) {
    try {
      fs.statSync(folderPath);
      return true;
    } catch (err) {
      return false;
    }
  },
  randomString(length, chars) {
    let mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    let result = '';
    for (let i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
  },
  isProjectExist(projectName) {
    const self = this;
    let isExist = false;

    this.pathArray.forEach(function (pathString) {
      const fullPath = path.resolve(__dirname, `${pathString}projects/${projectName}`);
      if (self.isExist(fullPath)) {
        isExist = true;
      }
    });
    return isExist;
  },
  createProject(option) {
    const self = this;

    if (!this.isProjectExist(option.project_name)) {
      this.pathArray.forEach(function (pathString) {
        let boilerplatePath = '';
        const newProjectPath = path.resolve(__dirname, `${pathString}projects/${option.project_name}`);

        if (option.duplicated_project) {
          if (self.isProjectExist(option.duplicated_project)) {
            boilerplatePath = path.resolve(__dirname, `${pathString}projects/${option.duplicated_project}`);
          } else {
            console.log('something wrong when duplicate');
            return;
          }
        } else {
          boilerplatePath = path.resolve(__dirname, `${pathString}boilerplate`);
        }

        try {
          fsextra.copySync(boilerplatePath, newProjectPath);
        } catch (err) {
          // console.log(err);
          console.error('There is an error to create new project');
        }
      });

      const routePath = path.resolve(__dirname, `../assets/projects/${option.project_name}/route.js`);
      const randomUrl = this.randomString(10, 'aA');
      const originalRoute = fs.readFileSync(routePath, 'utf8');
      const modifiedRoute = originalRoute.replace(/\'\/\'/g, `'\/${randomUrl}'`);
      fs.writeFileSync(routePath, modifiedRoute);
    } else {
      console.log('It already exist');
    }
  },
  removeProject(option) {
    if (this.isProjectExist(option.project_name)) {
      this.pathArray.forEach(function (pathString) {
        const ProjectPath = path.resolve(__dirname, `${pathString}projects/${option.project_name}`);
        try {
          fsextra.removeSync(ProjectPath);
        } catch (err) {
          console.error('There is an error to delete a project');
        }
      });
      console.log(`Project ${option.project_name} has been removed`);
    } else {
      console.log(`Could't find project ${option.project_name}`);
    }
  },
  renameProject(option) {
    this.pathArray.forEach(function (pathString) {
      const oldProjectPath = path.resolve(__dirname, `${pathString}projects/${option.old_project_name}`);
      const newProjectPath = path.resolve(__dirname, `${pathString}projects/${option.new_project_name}`);
      try {
        fs.renameSync(oldProjectPath, newProjectPath);
      } catch (err) {
        console.log('there is an error when rename the project');
      }
    });
  }
};
