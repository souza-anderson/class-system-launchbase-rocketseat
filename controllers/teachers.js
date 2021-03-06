
const fs = require('fs');
const data = require('../data.json');
const intl = require('intl');
const { age, graduation, date } = require('../utils');

exports.index = function(req, res) {
    const teachers = data.teachers.map(function(teacher) {
        const teacherFilter = {
            ...teacher,
            services: teacher.services.split(",")
        }

        return teacherFilter;
    });

    return res.render("teachers/index", { teachers });
}

exports.create = function(req, res) {
    return res.render('teachers/create');
}

exports.post = function(req, res) {

    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Please, fill all fields");
        }
    }

    let {avatar_url, name, birth, degree, class_type, services} = req.body;

    birth = Date.parse(birth);
    const created_at = Date.now();
    const id = Number(data.teachers[data.teachers.length - 1].id + 1);

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        degree,
        class_type,
        services,
        created_at
    });

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
        if (err) return res.send('Write file error!');

        return res.redirect(`/teachers/${id}`);
    });

    // return res.send(req.body);    
}

exports.edit = function(req, res) {
    const { id } = req.params;

    const foundTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id;
    });
    
    if (!foundTeacher) return res.send('Teacher not found!');

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth)
    }

    return res.render('teachers/edit', { teacher });
}

exports.put = function(req, res) {
    const { id } = req.body;
    let index = 0;

    const foundTeacher = data.teachers.find(function(teacher, foundIndex) {
        if (id == teacher.id) {
            index = foundIndex;
            return true;
        }
    })

    if (!foundTeacher) return res.send("Teacher not found!");

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.teachers[index] = teacher;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
        if (err) return res.send('Write file error!');
        
        return res.redirect(`/teachers/${id}`);
    });
}

exports.show = function(req, res) {
    const { id } = req.params;

    const foundTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id;
    });

    if (!foundTeacher) return res.send('Teacher not found!');


    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        degree: graduation(foundTeacher.degree),
        services: foundTeacher.services.split(","),
        created_at: new intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at)
    }

    return res.render('teachers/show', { teacher });
}

exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredTeachers = data.teachers.filter(function(teacher) {
            return id != teacher.id;        
    });

    data.teachers = filteredTeachers;

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err) {
        if (err) return res.send("Write file error!");

        return res.redirect('/teachers');
    })
}