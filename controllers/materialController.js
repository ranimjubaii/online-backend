import CourseLink from '../models/CourseLink.js';
const getAllMaterialsAdminView = async (req, res) => {
  try {
    const materials = await CourseLink.findAll();
    return res.status(200).json(materials);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addMaterial = async (req, res) => {
  try {
    const { course_id, title, link } = req.body;

    if (!course_id || !title || !link) {
      return res.status(400).json({ message: 'course_id, title, and link are required fields.' });
    }

    const material = await CourseLink.create({
      course_id,
      title,
      link
    });

    return res.status(201).json({ message: 'Material added successfully!', material });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateMaterial = async (req, res) => {
  try {
    const { course_id, title, link } = req.body;
    const material = await CourseLink.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material record asset not found.' });
    }
    material.course_id = course_id !== undefined ? course_id : material.course_id;
    material.title = title !== undefined ? title : material.title;
    material.link = link !== undefined ? link : material.link;

    await material.save();

    return res.status(200).json({ message: 'Material updated successfully!', material });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getCourseMaterials = async (req, res) => {
  try {
    const materials = await CourseLink.findAll({
      where: { course_id: req.params.courseId }
    });
    return res.status(200).json(materials);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await CourseLink.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await material.destroy();
    return res.status(200).json({ message: 'Material removed successfully!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { 
  getAllMaterialsAdminView, 
  addMaterial, 
  updateMaterial,
  getCourseMaterials, 
  deleteMaterial 
};