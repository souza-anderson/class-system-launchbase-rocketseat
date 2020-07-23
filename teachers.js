const fs = require('fs');
const data = require('./data.json');


// create
exports.post = function(req, res) {

    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Please, fill all fields");
        }
    }

    let {avatar_url, name, birth, degree, class_type, services} = req.body;

    birth = Date.now(birth);
    const created_at = Date.now();
    const id = Number(data.teachers.length + 1);

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

        return res.redirect('/teachers');
    });

    // return res.send(req.body);    
}

//find
exports.show = function(req, res) {
    const { id } = req.params;

    const foundTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id;
    });

    if (!foundTeacher) return res.send('Teacher not found!');

    const teacher = {
        ...foundTeacher,
        age: "",
        services: foundTeacher.services.split(","),
        created_at: ""
    }

    return res.render('teachers/show', { teacher });
}