import Course from '../models/Course.js';
const createCourse = async (req, res) => {
  try {
    const { course_name, description, price, hours, lesson, discount, status } = req.body;
    
    const imagePath = req.file ? req.file.filename : null;

    if (!course_name || !price) {
      return res.status(400).json({ message: 'Course name and price are required.' });
    }

    const course = await Course.create({
      course_name,
      description,
      price,
      hours,
      lesson,
      discount,
      status,
      image: imagePath
    });

    res.status(201).json({ message: 'Course created successfully!', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const { course_name, description, price, hours, lesson, discount, status } = req.body;
    const imagePath = req.file ? req.file.filename : course.image;
    await course.update({
      course_name: course_name !== undefined ? course_name : course.course_name,
      description: description !== undefined ? description : course.description,
      price: price !== undefined ? price : course.price,
      hours: hours !== undefined ? hours : course.hours,
      lesson: lesson !== undefined ? lesson : course.lesson,
      discount: discount !== undefined ? discount : course.discount,
      status: status !== undefined ? status : course.status,
      image: imagePath
    });

    res.json({ message: 'Course updated successfully!', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createCourse, getCourses, getCourseById, updateCourse, deleteCourse };