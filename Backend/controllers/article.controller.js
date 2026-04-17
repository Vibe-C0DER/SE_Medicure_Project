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

export const getArticleByDiseaseId = async (req, res) => {
  try {
    const { diseaseId } = req.params;

    const disease = await Disease.findById(diseaseId);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    if (disease.article) {
      const article = await Article.findById(disease.article).populate('disease', 'name severity specialist');
      if (article) {
        return res.status(200).json(article);
      }
    }

    // AI Fallback: Generate the article
    const generatedData = await generateDiseaseArticle(disease.name);

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

    // Link it back to the disease
    disease.article = newArticle._id;
    await disease.save();

    await newArticle.populate('disease', 'name severity specialist');

    return res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error fetching/generating article:', error);
    return res.status(500).json({ message: 'Failed to process request', error: error.message });
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
