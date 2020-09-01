
const fs = require('fs');
const data = require('../data.json');
const intl = require('intl');
const { age, graduation, date } = require('../utils');



exports.index = function(req, res) {
    const students = data.students.map(function(student) {
        const studentFilter = {
            ...student,
            services: student.services.split(",")
        }

        return studentFilter;
    });

    return res.render("students/index", { students });
}

exports.create = function(req, res) {
    return res.render('students/create');
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
    const id = Number(data.students.length + 1);

    data.students.push({
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

        return res.redirect(`/students/${id}`);
    });

    // return res.send(req.body);    
}

exports.edit = function(req, res) {
    const { id } = req.params;

    const foundStudent = data.students.find(function(student) {
        return student.id == id;
    });
    
    if (!foundStudent) return res.send('Student not found!');

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth)
    }

    return res.render('students/edit', { student });
}

exports.put = function(req, res) {
    const { id } = req.body;
    let index = 0;

    const foundStudent = data.students.find(function(student, foundIndex) {
        if (id == student.id) {
            index = foundIndex;
            return true;
        }
    })

    if (!foundStudent) return res.send("Student not found!");

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.students[index] = student;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
        if (err) return res.send('Write file error!');
        
        return res.redirect(`/students/${id}`);
    });
}

exports.show = function(req, res) {
    const { id } = req.params;

    const foundStudent = data.students.find(function(student) {
        return student.id == id;
    });

    if (!foundStudent) return res.send('Student not found!');


    const student = {
        ...foundStudent,
        age: age(foundStudent.birth),
        degree: graduation(foundStudent.degree),
        services: foundStudent.services.split(","),
        created_at: new intl.DateTimeFormat('pt-BR').format(foundStudent.created_at)
    }

    return res.render('students/show', { student });
}

exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredStudents = data.students.filter(function(student) {
            return id != student.id;        
    });

    data.students = filteredStudents;

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err) {
        if (err) return res.send("Write file error!");

        return res.redirect('/students');
    })
}