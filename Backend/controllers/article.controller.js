import Article from '../models/article.model.js';
import Disease from '../models/disease.model.js';
import { generateDiseaseArticle } from '../services/ai.service.js';

export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isActive: true })
      .select('_id title description category createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ message: 'Failed to fetch articles', error: error.message });
  }
};

// export const getArticleByDiseaseId = async (req, res) => {
//   try {
//     const { diseaseId } = req.params;

//     const disease = await Disease.findById(diseaseId);
//     if (!disease) {
//       return res.status(404).json({ message: 'Disease not found' });
//     }

//     if (disease.article) {
//       const article = await Article.findById(disease.article).populate('disease', 'name severity specialist');
//       if (article) {
//         return res.status(200).json(article);
//       }
//     }

//     // AI Fallback: Generate the article
//     const generatedData = await generateDiseaseArticle(disease.name);

//     const newArticle = new Article({
//       title: generatedData.title,
//       description: generatedData.description,
//       content: generatedData.content,
//       symptoms: generatedData.symptoms,
//       riskFactors: generatedData.riskFactors,
//       prevention: generatedData.prevention,
//       category: generatedData.category,
//       disease: disease._id,
//     });

//     await newArticle.save();

//     // Link it back to the disease
//     disease.article = newArticle._id;
//     await disease.save();

//     await newArticle.populate('disease', 'name severity specialist');

//     return res.status(201).json(newArticle);
//   } catch (error) {
//     console.error('Error fetching/generating article:', error);
//     return res.status(500).json({ message: 'Failed to process request', error: error.message });
//   }
// };
export const getArticleByDiseaseId = async (req, res) => {
  try {
    const { diseaseId } = req.params;

    const disease = await Disease.findById(diseaseId);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    
    if (disease.article) {
      const article = await Article.findById(disease.article)
        .populate('disease', 'name severity specialist');

      if (article) {
        return res.status(200).json(article);
      }
    }

    let generatedData = null;

   
    try {
      generatedData = await generateDiseaseArticle(disease.name);
    } catch (aiError) {
      console.error("AI generation failed:", aiError.message);
    }

    
    if (generatedData && generatedData.title) {
      const newArticle = new Article({
        title: generatedData.title,
        description: generatedData.description,
        content: generatedData.content,
        symptoms: generatedData.symptoms,
        riskFactors: generatedData.riskFactors,
        prevention: generatedData.prevention,
        category: generatedData.category,
        disease: disease._id,
      });

      await newArticle.save();

      disease.article = newArticle._id;
      await disease.save();

      await newArticle.populate('disease', 'name severity specialist');

      return res.status(201).json(newArticle);
    }

 
    console.log("⚠️ Falling back to DB");

    const fallbackArticle = await Article.findOne({
      disease: disease._id,
      isActive: true
    }).populate('disease', 'name severity specialist');

    if (fallbackArticle) {
      return res.status(200).json(fallbackArticle);
    }

    
    return res.status(200).json({
      title: disease.name,
      description: `Information about ${disease.name} is currently limited.`,
      content: `Details for ${disease.name} are not available right now. Please try again later.`,
      symptoms: "No symptom data available.",
      riskFactors: "No risk factor data available.",
      prevention: "No prevention data available.",
      category: disease.category || "General",
      disease: disease
    });

  } catch (error) {
    console.error('Error fetching/generating article:', error);
    return res.status(500).json({
      message: 'Failed to process request',
      error: error.message
    });
  }
};
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id).populate('disease', 'name severity');
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json(article);
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return res.status(500).json({ message: 'Failed to fetch article', error: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const newArticle = new Article({ ...req.body });
    await newArticle.save();
    if (newArticle.disease) {
      await Disease.findByIdAndUpdate(newArticle.disease, { article: newArticle._id });
    }
    return res.status(201).json(newArticle);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create article', error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });
    return res.status(200).json(updatedArticle);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update article', error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Article.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!deleted) return res.status(404).json({ message: 'Article not found' });
    return res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete article', error: error.message });
  }
};

